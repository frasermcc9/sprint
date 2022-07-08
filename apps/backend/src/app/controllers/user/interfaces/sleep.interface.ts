export interface SleepResponse {
  pagination: Pagination;
  sleep: Sleep[];
}

export interface Pagination {
  beforeDate: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  sort: string;
}

export interface Sleep {
  dateOfSleep: string;
  duration: number;
  efficiency: number;
  endTime: string;
  infoCode: number;
  isMainSleep: boolean;
  levels: Levels;
  logId: number;
  logType: string;
  minutesAfterWakeup: number;
  minutesAsleep: number;
  minutesAwake: number;
  minutesToFallAsleep: number;
  startTime: string;
  timeInBed: number;
  type: string;
}

export interface Levels {
  data: LevelsData[];
  shortData: ShortLevelsData[];
  summary: Summary;
}

export interface LevelsData {
  dateTime: string;
  level: string;
  seconds: number;
}

export interface ShortLevelsData {
  dateTime: string;
  level: string;
  seconds: number;
}

export interface Summary {
  deep: StageSummary;
  light: StageSummary;
  rem: StageSummary;
  wake: StageSummary;
}

export interface StageSummary {
  count: number;
  minutes: number;
  thirtyDayAvgMinutes: number;
}
