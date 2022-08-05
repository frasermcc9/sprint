export const ASSERT = (fn: () => boolean) => {
  if (!fn()) {
    throw new Error(`Assertion failed for ${fn.toString()}`);
  }
};

export const assertions = {
  ASSERT,
};
