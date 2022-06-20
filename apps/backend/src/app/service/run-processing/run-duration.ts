/**
 *
 * @param currentParams Current params should always be 13minutes.
 * @param duration
 * @returns
 */
export const formatDuration = (
  currentParams: {
    highIntensity: number;
    lowIntensity: number;
    repetitions: number;
    sets: number;
    restPeriod: number;
  },
  duration: number,
) => {
  const timeAtHigh =
    currentParams.highIntensity *
    currentParams.repetitions *
    currentParams.sets;
  const timeAtLow =
    currentParams.lowIntensity * currentParams.repetitions * currentParams.sets;
  const timeAtRest = currentParams.restPeriod * (currentParams.sets - 1);

  const currentDuration = timeAtHigh + timeAtLow + timeAtRest;

  if (duration == currentDuration) {
    return currentParams;
  }

  const newParams = currentParams;

  if (duration == 10) {
    newParams.highIntensity = Math.max(
      (10 / 13) * currentParams.highIntensity,
      15,
    );

    // Calculate new params based on time at high intensity is 30% of full time.

    // BUG: this is not correct:
    // const timeAtMax =
    //   newParams.highIntensity * currentParams.repetitions * currentParams.sets;
    // const remainingTime = (timeAtMax / 3) * 7;
    // newParams.lowIntensity = remainingTime / 4;
    // newParams.restPeriod = Math.min(
    //   remainingTime - newParams.lowIntensity,
    //   120,
    // );
  }
  return newParams;
};
