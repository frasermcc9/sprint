export const ASSERT = (fn: () => boolean) => {
  if (!fn()) {
    throw new Error(`Assertion failed for ${fn.toString()}`);
  }
};

export const NOT_NULL = <T>(defaultValue: T, value?: T): T => {
  if (value === undefined || value === null) {
    console.error(`Not-nullish assertion failed for ${value}`);
    return defaultValue;
  }
  return value;
};

export const assertions = {
  ASSERT,
  NOT_NULL,
};
