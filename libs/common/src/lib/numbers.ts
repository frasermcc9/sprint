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

export const Numbers = {
  clamp,
};
