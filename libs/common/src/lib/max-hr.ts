export const calculateMaxHr = (dob: string) => {
  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  return Math.round(211 - 0.64 * age);
};
