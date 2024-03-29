
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum ExperienceLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED"
}

export enum AccountStage {
    INITIAL = "INITIAL",
    EXPERIENCE_LEVEL_SELECTED = "EXPERIENCE_LEVEL_SELECTED",
    INITIAL_RUN = "INITIAL_RUN"
}

export enum InRun {
    YES = "YES",
    NO = "NO",
    FEEDBACK = "FEEDBACK"
}

export interface RunInput {
    userId?: Nullable<string>;
    date?: Nullable<string>;
    duration?: Nullable<number>;
    heartRate?: Nullable<Nullable<number>[]>;
    vo2max?: Nullable<number>;
    intensityFeedback?: Nullable<number>;
}

export interface Auth {
    access_token?: Nullable<string>;
    expires_in?: Nullable<number>;
    refresh_token?: Nullable<string>;
    scope?: Nullable<string>;
    token_type?: Nullable<string>;
    user_id?: Nullable<string>;
}

export interface IQuery {
    getAuthLink(): string | Promise<string>;
    testAuth(): Nullable<string> | Promise<Nullable<string>>;
    analyzeSleep(): Nullable<SleepAnalysis> | Promise<Nullable<SleepAnalysis>>;
    currentUser(): Nullable<User> | Promise<Nullable<User>>;
    prepRun(duration: number): Nullable<RunParams> | Promise<Nullable<RunParams>>;
    generateRunFeedback(run: RunInput): Nullable<Feedback> | Promise<Nullable<Feedback>>;
}

export interface IMutation {
    login(code: string): Nullable<Auth> | Promise<Nullable<Auth>>;
    refresh(token: string): Nullable<Auth> | Promise<Nullable<Auth>>;
    createRun(startDate: string, endDate: string, startTime: string, endTime: string, intensity: number): Nullable<Run> | Promise<Nullable<Run>>;
    resyncRun(startDate: string, startTime: string, duration: number, intensity: number): Nullable<Run> | Promise<Nullable<Run>>;
    createEvent(event: string, payload?: Nullable<string>): Nullable<AnalyticsEvent> | Promise<Nullable<AnalyticsEvent>>;
    addSleepVariable(name: string, emoji: string, custom: boolean, sleepDate: string): Nullable<VariableEditResponse> | Promise<Nullable<VariableEditResponse>>;
    removeSleepVariable(name: string, sleepDate: string): Nullable<VariableEditResponse> | Promise<Nullable<VariableEditResponse>>;
    trackVariable(name: string): string[] | Promise<string[]>;
    untrackVariable(name: string): string[] | Promise<string[]>;
    updateExperienceLevel(): Nullable<ExperienceLevel> | Promise<Nullable<ExperienceLevel>>;
    completeOnboarding(experience: ExperienceLevel, firstName: string, lastName: string, dob: string): Nullable<User> | Promise<Nullable<User>>;
    updateDefaultRunDuration(duration: number): number | Promise<number>;
    markFeatureSeen(feature: string): Nullable<string>[] | Promise<Nullable<string>[]>;
    updateProfile(firstName: string, lastName: string, dob: string): Nullable<User> | Promise<Nullable<User>>;
    updateEmblem(emblem: string): string | Promise<string>;
    sendFriendRequest(friendId: string): Nullable<boolean> | Promise<Nullable<boolean>>;
    acceptFriendRequest(friendId: string): PublicUser | Promise<PublicUser>;
    rejectFriendRequest(friendId: string): string | Promise<string>;
    updateRunParams(intensityFeedback: number): Nullable<User> | Promise<Nullable<User>>;
    updateProfilePic(avatarUrl: string): Nullable<User> | Promise<Nullable<User>>;
    createSleepVariable(emoji: string, name: string): SleepVariable | Promise<SleepVariable>;
    updateInRun(inRun: InRun): Nullable<User> | Promise<Nullable<User>>;
    updateNextRunTimes(nextRunStart: string, nextRunEnd: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface Run {
    userId?: Nullable<string>;
    date?: Nullable<string>;
    duration?: Nullable<number>;
    heartRate?: Nullable<Nullable<number>[]>;
    vo2max?: Nullable<number>;
    intensityFeedback?: Nullable<number>;
}

export interface AnalyticsEvent {
    user: string;
    event: string;
    payload?: Nullable<string>;
}

export interface Sleep {
    awake: number;
    rem: number;
    light: number;
    deep: number;
    awakenings: number;
    score: number;
    ownerId: string;
    date: string;
    variables?: Nullable<Nullable<SleepVariable>[]>;
    yesterday: string;
    tomorrow: string;
}

export interface SleepVariable {
    name: string;
    emoji?: Nullable<string>;
    custom: boolean;
}

export interface VariableEditResponse {
    date: string;
    variables: Nullable<SleepVariable>[];
}

export interface SleepAnalysisComponent {
    variable: string;
    regressionGradient: number;
}

export interface SleepAnalysis {
    components: SleepAnalysisComponent[];
    regressionIntercept: number;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    createdAtUTS: number;
    utcOffset: number;
    experience?: Nullable<ExperienceLevel>;
    stage: AccountStage;
    runs: Run[];
    maxHr: number;
    dob: string;
    defaultRunDuration: number;
    currentRunParams: RunParams;
    features: Nullable<string>[];
    avatarUrl: string;
    emblem: string;
    availableEmblems: string[];
    xp: number;
    friends: PublicUser[];
    friendRequests: Nullable<PublicUser>[];
    todaysSleep: Nullable<Sleep>[];
    sleepVariables?: Nullable<Nullable<SleepVariable>[]>;
    trackedVariables: string[];
    shareableSleepScore: number;
    inRun: InRun;
    nextRunStart: string;
    nextRunEnd: string;
    lastIntensityFeedback: number;
    dailyGoals: DailyGoal[];
    runTrackStreak: number;
}

export interface PublicUser {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    xp: number;
    emblem: string;
    shareableSleepScore: number;
}

export interface DailyGoal {
    name: string;
    description: string;
    completed: number;
    quantity: number;
    reward: number;
    emoji: string;
}

export interface RunParams {
    highIntensity?: Nullable<number>;
    lowIntensity?: Nullable<number>;
    repetitions?: Nullable<number>;
    sets?: Nullable<number>;
    restPeriod?: Nullable<number>;
}

export interface Feedback {
    feedbackSummary?: Nullable<string>;
    lastRunFeedback?: Nullable<string>;
    intensityFeedback?: Nullable<string>;
    volumeFeedback?: Nullable<string>;
    performanceFeedback?: Nullable<string>;
}

type Nullable<T> = T | null;
