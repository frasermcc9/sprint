const clamp = (
  value: number,
  min: number,
  max: number,
  { round }: { round?: boolean } = {},
) => {
  if (round) {
    return Math.round(Math.min(Math.max(value, min), max));
  }
  return Math.min(Math.max(value, min), max);
};

const rndToRange = <T>(rndNum: number, arr: T[]) => {
  if (rndNum < 0 || rndNum >= 1) {
    throw new Error("rndNum must be between 0 and 1");
  }
  return arr[Math.floor(rndNum * arr.length)];
};

export const Numbers = {
  clamp,
  rndToRange,
};
