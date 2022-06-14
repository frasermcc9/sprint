import { calculateAge } from "./dates";

export const calculateMaxHr = (dob: string) => {
  const age = calculateAge(dob);
  return Math.round(211 - 0.64 * age);
};
