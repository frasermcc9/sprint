export const emblemList = [
  "Level1",
  "Level2",
  "Level3",
  "Level4",
  "Level5",
  "Level6",
] as const;

export const emblemSet = new Set(emblemList);

export type EmblemImageMap = {
  [key in typeof emblemList[number]]: string | any;
};

export type EmblemImageUnion = keyof EmblemImageMap;

export const isValidEmblem = (bg?: string): bg is EmblemImageUnion => {
  return emblemSet.has(bg as EmblemImageUnion);
};

export const emblemDescription: Record<EmblemImageUnion, string> = {
  Level1: "Default emblem",
  Level2: "Requires level 5",
  Level3: "Requires level 10",
  Level4: "Requires level 15",
  Level5: "Requires level 20",
  Level6: "Requires level 25",
};
