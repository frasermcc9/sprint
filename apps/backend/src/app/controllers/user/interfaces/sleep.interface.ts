export interface LevelData {
  dateTime: Date;
  level: string;
  seconds: number;
}

export interface ShortData {
  dateTime: Date;
  level: string;
  seconds: number;
}

export interface SleepSegment {
  count: number;
  minutes: number;
  thirtyDayAvgMinutes: number;
}

export interface SleepLevelSummary {
  deep: SleepSegment;
  light: SleepSegment;
  rem: SleepSegment;
  wake: SleepSegment;
}

export interface Levels {
  data: LevelData[];
  shortData: ShortData[];
  summary: SleepLevelSummary;
}

export interface Sleep {
  dateOfSleep: string;
  duration: number;
  efficiency: number;
  endTime: Date;
  infoCode: number;
  isMainSleep: boolean;
  levels: Levels;
  logId: number;
  logType: string;
  minutesAfterWakeup: number;
  minutesAsleep: number;
  minutesAwake: number;
  minutesToFallAsleep: number;
  startTime: Date;
  timeInBed: number;
  type: string;
}

export interface Stages {
  deep: number;
  light: number;
  rem: number;
  wake: number;
}

export interface SleepSummary {
  stages: Stages;
  totalMinutesAsleep: number;
  totalSleepRecords: number;
  totalTimeInBed: number;
}

export interface SleepResponse {
  sleep: Sleep[];
  summary: SleepSummary;
}
