import { format } from "date-fns";

export const calculateAge = (dob: string) => {
  return new Date().getFullYear() - new Date(dob).getFullYear();
};

export const readableTime = (seconds: number) =>
  format(seconds * 1000, "hh:mm:ss");

const formatYYYYMMDD = new Intl.DateTimeFormat("fr-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
export const toYYYYMMDD = (date: Date) => {
  return formatYYYYMMDD.format(date);
};

const formatMonthYYYY = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
});
export const toMonthYYYY = (date: Date) => {
  return formatMonthYYYY.format(date);
};
