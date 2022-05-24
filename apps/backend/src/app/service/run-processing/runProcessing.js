/**
 * Mock Data
 */
const currentHiitParams = {
  // base recommendations for untrained individual, see High-Intensity Interval Training, Solutionsto the Programming Puzzle
  // TOTAL TIME: 13 minutes
  // time at high intensity: 4.5 minutes
  // ideally 48 hours between each run, less if not very exhausting
  // need to aim for 5-7 minutes at VO2 max for team sports, so start at 2 minutes
  // 11 minutes for endurance athletes
  highIntensity: 30, // how many seconds each high intensity interval should be
  lowIntensity: 30, // how many seconds each rest period of walking should be
  repetitions: 3, // per set
  sets: 3, // total sets per session
  restPeriod: 120, // break between sets, (research says >3/4min/2min)
};
const currentUser = {
  name: "John Doe",
};
const rpeFeedback = 18;

const calculateNewParams = (currentParams, rpeFeedback) => {
  if (rpeFeedback === 10) {
    return currentParams;
  }

  const newParams = currentParams;

  if (rpeFeedback < 9) {
    const multiplier = ((10 - rpeFeedback) / 8) * 0.3;
    newParams.highIntensity = Math.min(
      currentParams.highIntensity * (1 + multiplier),
      600,
    );
  } else if (rpeFeedback > 11) {
    const multiplier = ((rpeFeedback - 11) / 10) * 0.3;
    newParams.highIntensity = Math.max(
      currentParams.highIntensity * (1 - multiplier),
      15,
    );
  }

  // calculate new low intensity and rest period based on new high intensity
  const timeAtMax =
    newParams.highIntensity * currentParams.repetitions * currentParams.sets;
  const rest = timeAtMax / 0.3 - timeAtMax;
  newParams.lowIntensity = rest / 4;
  newParams.restPeriod = Math.min(rest - newParams.lowIntensity, 120);

  return newParams;
};
