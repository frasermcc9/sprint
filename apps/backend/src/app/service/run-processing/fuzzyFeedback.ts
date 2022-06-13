import { Fuzzy } from "./fuzzyHelpers";
import { explanations } from "./HIITreasoning";
import { differenceInDays } from "date-fns";
import { last, partition, sumBy, maxBy } from "lodash";
import { Run } from "../../db/schema/run.schema";
import { User } from "../../db/schema/user.schema";

// >>> all membership functions take in a percentage change (i.e 10 is 10% increase). Should be clamped to -100 .. 100
// normalized to 0 .. 200

const PERF_DECREASE = "decrease in performance";
const PERF_STEADY = "steady performance";
const PERF_INCREASE = "increase in performance";
const PERF_LARGE_INCREASE = "large increase in performance";

const INTENSITY_LOW = "low intensity";
const INTENSITY_OK = "good intensity";
const INTENSITY_HIGH = "high intensity";

const DRIFT_LOW = "low drift";
const DRIFT_OK = "ok drift";
const DRIFT_HIGH = "high drift";

const RPE_EASY = "low exertion";
const RPE_OK = "moderate exertion";
const RPE_HARD = "hard exertion";

// fuzzy model inferences

const inferences = {
  overExertion:
    "Your performance is not increasing even though your runs are very intense — this is usually due to lack of rest (48 hours between each run) and overexertion.",
  okPerformance:
    "Although your performance has decreased, the quality of your training has been good! It is normal to see a decrease in performance before your body adapts and improves. Remember to take adequate breaks between exercise (48 hours).",
  goodPerformance: "Your performance has been steadily increasing. Great work!",
  underExertion:
    "You seem to not be exerting yourself much. Maybe try a little challenge! Remember that HIIT is most effective when you run at 80%+ of your maximum HR.",
};
// fuzzy model membership (.trapezoid does not exisit)
const fuzzyModel = new Fuzzy()
  .trapezoid("performance", PERF_DECREASE, 0, 10, 50, 85)
  .trapezoid("performance", PERF_STEADY, 80, 90, 110, 120)
  .trapezoid("performance", PERF_INCREASE, 110, 120, 130, 140)
  .trapezoid("performance", PERF_LARGE_INCREASE, 130, 150, 190, 200)

  .trapezoid("intensity", INTENSITY_LOW, 0, 10, 40, 60)
  .trapezoid("intensity", INTENSITY_OK, 50, 60, 70, 90)
  .trapezoid("intensity", INTENSITY_HIGH, 80, 95, 100, 120)

  // % drift
  .trapezoid("cardiacDrift", DRIFT_LOW, 0, 5, 20, 25)
  .trapezoid("cardiacDrift", DRIFT_OK, 20, 25, 30, 35)
  .trapezoid("cardiacDrift", DRIFT_HIGH, 25, 30, 90, 100)

  .trapezoid("rpe", RPE_EASY, 6, 7, 12, 13)
  .trapezoid("rpe", RPE_OK, 12, 13, 14, 15)
  .trapezoid("rpe", RPE_HARD, 14, 15, 19, 20);

// // fuzzy model rules
fuzzyModel
  .if(PERF_DECREASE)
  .or(PERF_STEADY)
  .and(DRIFT_HIGH)
  .and(RPE_HARD)
  .then("overExertion")

  .if(PERF_STEADY)
  .or(PERF_INCREASE)
  .or(PERF_LARGE_INCREASE)
  .and(INTENSITY_OK)
  .then("goodPerformance")

  .if(RPE_EASY)
  .or(RPE_OK)
  .and(INTENSITY_LOW)
  .then("underExertion")

  .if(PERF_DECREASE)
  .and(INTENSITY_OK)
  .and(RPE_OK)
  .then("okPerformance");

// calculate percentage changes and feedback
// Never used
// const percentDifference = (original, current) => {
//   return ((current - original) / original) * 100;
// };

// calculate the average of metrics for a user for a set of runs
// (user baseline)
const calculateAverages = (user: User, runs: [Run]) => {
  // const highHR = 0.8 * user.maxHR;
  const highHR = 190;
  // cardiac drift is difference between max change in speed vs. max change in hr
  const result = {
    intensity: 0,
    cardiacDrift: 0,
    performance: 0,
    rpe: 0,
  };

  runs.forEach((run) => {
    const timeInHighHR = sumBy(run.heartRate, (hr) => (hr >= highHR ? 1 : 0));
    result.intensity += timeInHighHR / run.heartRate.length;
    result.performance += run.vo2max;
    result.rpe += run.intensityFeedback;

    let avSpeed = 0;
    let avHR = 0;
    let maxSpeed = 0;
    let maxHR = 0;

    run.heartRate.forEach((hr) => {
      maxHR = Math.max(hr, maxHR);
      avHR += hr;
    });

    run.speed.forEach((speed) => {
      maxSpeed = Math.max(speed, maxSpeed);
      avSpeed += speed;
    });

    avHR /= run.heartRate.length;
    avSpeed /= run.speed.length;

    const changeInHR = (maxHR - avHR) / avHR;
    const changeInSpeed = (maxSpeed - avSpeed) / avSpeed;

    result.cardiacDrift += Math.max(changeInHR - changeInSpeed, 0);
  });

  result.intensity /= runs.length;
  result.rpe /= runs.length;
  result.performance /= runs.length;
  result.cardiacDrift /= runs.length;

  return result;
};

// calculate the change in metrics for a user between two sets of runs
// (Not used in previous implementation?)
// const calculateChange = (user: User, firstRuns: [Run], secondRuns: [Run]) => {
//   const firstAverages = calculateAverages(user, firstRuns);
//   const secondAverages = calculateAverages(user, secondRuns);
//   const diff = {
//     changeInIntensity: percentDifference(
//       firstAverages.intensity,
//       secondAverages.intensity,
//     ),
//     changeInPerformance: percentDifference(
//       firstAverages.performance,
//       secondAverages.performance,
//     ),
//     changeInCardiacDrift: percentDifference(
//       firstAverages.cardiacDrift,
//       secondAverages.cardiacDrift,
//     ),
//   };
//   return diff;
// };

/**
 * Generates long-term feedback for a user using their runs (both single run and over time)
 */
const generateFeedback = (user: User, runs: Run[]) => {
  const feedback = {
    feedbackSummary:
      "Once you've completed more than 1 week of runs, we will start comparing your progress over the past few weeks.",
    lastRunFeedback:
      "Your last run was an calibration run. We'll provide more feedback after each run!",
    intensityFeedback: "",
    volumeFeedback: "",
    performanceFeedback: "",
  };

  // technically need at least 2 runs (including onboarding)
  if (!runs || runs.length < 2) return feedback;

  const lastRun = last(runs);

  // add lastRunFeedback
  const lastRunStats = calculateAverages(user, [lastRun]);

  const intensity = (val: number) => {
    if (val < 0.7)
      return "lower than optimal. Try to keep your exertion higher and constant throughout your sprinting! You can also try a more challenging warm-up to get to the correct heart-zone more easily. If you found the run to be difficult, the next one will be easier.";
    if (val < 0.85)
      return "ok. If you found the run to be not too challenging, you can try a more exerting warm up to keep you in the optimal heartrate zone. Well done!";
    return "very optimal. Well done!";
  };

  const cardiac = (val: number) => {
    if (val < 0.3) return "low. Excellent!";
    if (val < 0.5)
      return "moderate. This means at the same pace, your body had to work harder. Remember to take adequate rest (48 hours between runs) and stay hydrated. Keep training at a good exertion level and this will improve!";
    return "high. If this isn't due to faulty hardware sensors, you are probably overexerting yourself and should train at lower intensities.";
  };

  feedback.lastRunFeedback = `The time spent at the right intensity (> 80% max heartrate) of your run was ${intensity(
    lastRunStats.intensity,
  )} The cardiac drift of your run was ${cardiac(lastRunStats.cardiacDrift)}`;

  // check weeks
  const numberOfDays = differenceInDays(lastRun.date, runs[0].date);
  if (numberOfDays < 7) return feedback;

  const firstWeek: Run[] = [];
  let i = 1;
  let dayDiff = 0;

  while (i < runs.length && dayDiff < 7) {
    firstWeek.push(runs[i]);
    dayDiff = differenceInDays(runs[i].date, runs[0].date);
    i++;
  }

  return feedback;
};

/**
 * Generates single run feedback for a user's last run
 */

module.exports = {
  generateFeedback,
};
