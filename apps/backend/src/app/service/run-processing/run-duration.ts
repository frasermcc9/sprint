/**
 *
 * @param currentParams Current params should always be 13minutes.
 * @param duration Duration of the run.
 * @returns Editted params to fit new duration
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
  const newParams = currentParams;

  // Note all durations are approximate, more time will be needed for warmup and cooldown.
  switch (duration) {
    case 8:
      newParams.sets = currentParams.sets - 1;
      break;
    case 13:
      return currentParams;
    case 18:
      newParams.sets = currentParams.sets + 1;
      break;
    case 23:
      // roughly 23 minutes
      newParams.highIntensity = currentParams.highIntensity + 2;
      newParams.lowIntensity = currentParams.lowIntensity + 2;
      newParams.sets = currentParams.sets + 1;
      newParams.repetitions = currentParams.repetitions + 1;
      break;
    case 28:
      newParams.sets = currentParams.sets + 2;
      newParams.repetitions = currentParams.repetitions + 1;
      break;
  }

  return newParams;
};
