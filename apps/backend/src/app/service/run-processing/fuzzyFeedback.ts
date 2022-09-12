// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { Fuzzy } from "./fuzzyHelpers";
import { last, sumBy } from "lodash";
import { Run } from "../../db/schema/run.schema";

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

// calculate the average of metrics for a user for a set of runs
const calculateAverages = (maxHR: number, runs: [Run]) => {
  const highHR = 0.8 * maxHR;

  const result = {
    intensity: 0,
  };

  runs.forEach((run) => {
    const timeInHighHR = sumBy(run.heartRate, (hr) => (hr >= highHR ? 1 : 0));
    result.intensity += timeInHighHR / run.heartRate.length;
  });

  result.intensity /= runs.length;

  return result;
};

/**
 * Generates long-term feedback for a user using their runs (both single run and over time)
 */
export const generateFeedback = (maxHR: number, runs: Run[]) => {
  const feedback = {
    feedbackSummary:
      "Feedback Summary goes here. This is a placeholder for now.",
    lastRunFeedback:
      "Last Run Feedback goes here. This is a placeholder for now.",

    intensityFeedback: "",
    volumeFeedback: "",
    performanceFeedback: "",
  };

  // technically need at least 2 runs (including onboarding)
  if (!runs) return feedback;

  const lastRun = last(runs);

  // add lastRunFeedback
  const lastRunStats = calculateAverages(maxHR, [lastRun]);

  const intensity = (val: number) => {
    if (val < 0.5)
      return "lower than optimal. Try to keep your exertion higher and constant throughout your sprinting! You can also try a more challenging warm-up to get to the correct heart-zone more easily.";
    if (val < 0.75)
      return "ok. If you found the run to be not too challenging, you can try a more exerting warm up to keep you in the optimal heartrate zone. Well done!";
    return "very optimal. Well done!";
  };

  feedback.lastRunFeedback = `The time spent at the right intensity of your run was ${intensity(
    lastRunStats.intensity,
  )} `;

  return feedback;
};

/**
 * Generates single run feedback for a user's last run
 */

module.exports = {
  generateFeedback,
};
