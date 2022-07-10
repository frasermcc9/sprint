export interface SleepRangeResponse {
  sleep: Sleep[];
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
  data: SleepRangeLevelsData[];
  shortData: SleepRangeLevelsShortData[];
  summary: SleepRangeLevelsSummary;
}

export interface SleepRangeLevelsData {
  dateTime: string;
  level: string;
  seconds: number;
}

export interface SleepRangeLevelsShortData {
  dateTime: string;
  level: string;
  seconds: number;
}

export interface SleepRangeLevelsSummary {
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
