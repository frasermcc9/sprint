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
