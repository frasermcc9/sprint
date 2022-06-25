/**
 * Returns cumulative xp required to reach a level
 * @param level the level
 * @returns the cumulative xp to reach this level
 */
export const expFunction = (level: number) => {
  let value = 0;
  if (level === 0) {
    return 0;
  } else if (level === 1) {
    return 25;
  } else if (level < 30) {
    value = (5 / 9) * (level + 1) * (4 * level ** 2 - 4 * level + 27);
  } else {
    const upTo30 = (5 / 9) * (30 + 1) * (4 * 30 ** 2 - 4 * 30 + 27);
    const rest = (level - 30) * 6000;
    value = upTo30 + rest;
  }
  return Math.round(value);
};

/**
 * The experience required to go from (level - 1) to (level)
 */
export const expForLevel = (level: number) => {
  return expFunction(level) - expFunction(level - 1);
};

/**
 * Returns the level that a player with xp *x* would be
 * @param xp the cumulative xp of the player
 * @returns the level that the player would be
 */
export const inverseExpFunction = (xp: number) => {
  for (let i = 0; ; i++) {
    if (expFunction(i) > xp) {
      return i - 1;
    }
  }
};

/**
 * Gets details about the exp number provided
 *
 * @param xp
 * @returns
 */
export const xpDetails = (xp: number) => {
  const level = inverseExpFunction(xp);
  const xpToReach = expFunction(level);
  const xpThroughLevel = xp - xpToReach;

  const xpRequiredForLevel = expForLevel(level + 1);
  const xpForUser = xpRequiredForLevel - xpThroughLevel;

  return { xpRequiredForLevel, xpForUser, level, xpThroughLevel };
};
