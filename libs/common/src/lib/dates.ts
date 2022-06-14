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
