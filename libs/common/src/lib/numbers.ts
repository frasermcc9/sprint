import { ASSERT } from "./assertions";

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

const uniqueRandomRange = <T>(
  randomNums: number[],
  arr: T[] | readonly T[],
) => {
  ASSERT(() => randomNums.length <= arr.length);

  const arrCopy = [...arr];
  const result: T[] = [];
  while (randomNums.length) {
    const rndNum = randomNums.shift() ?? 0;
    const index = Math.floor(rndNum * arrCopy.length);

    result.push(arrCopy[index]);
    arrCopy.splice(index, 1);
  }

  return result;
};

export const Numbers = {
  clamp,
  rndToRange,
  uniqueRandomRange,
};
