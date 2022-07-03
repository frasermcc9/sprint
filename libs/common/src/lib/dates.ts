import { format } from "date-fns";

export const calculateAge = (dob: string) => {
  return new Date().getFullYear() - new Date(dob).getFullYear();
};

export const readableTime = (seconds: number) =>
  format(seconds * 1000, "hh:mm:ss");

export const readableTimeNoSeconds = (
  minutes: number,
  { suffix }: { suffix?: boolean } = {},
) =>
  minutes > 60
    ? new Date(minutes * 60 * 1000)
        .toISOString()
        .slice(11, 16)
        .replace(/^0/, "") + (suffix ? "h" : "")
    : new Date(minutes * 60 * 1000)
        .toISOString()
        .slice(14, 16)
        .replace(/^0/, "") + (suffix ? "m" : "");

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

export const modFloor = (num: number, mod: number) => ((num % mod) + mod) % mod;

export const daysForLocale = (
  localeName = "es-MX",
  weekday: "long" | "short" | "narrow" = "long",
) => {
  const format = new Intl.DateTimeFormat(localeName, { weekday }).format;
  return [...Array(7).keys()].map((day) =>
    format(new Date(Date.UTC(2021, 5, day))),
  );
};
