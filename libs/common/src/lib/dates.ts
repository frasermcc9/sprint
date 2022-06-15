import { format } from "date-fns";

const formatter = new Intl.DateTimeFormat("fr-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const calculateAge = (dob: string) => {
  return new Date().getFullYear() - new Date(dob).getFullYear();
};

export const toYYYYMMDD = (date: Date) => {
  return formatter.format(date);
};

export const readableTime = (seconds: number) =>
  format(seconds * 1000, "hh:mm:ss");
