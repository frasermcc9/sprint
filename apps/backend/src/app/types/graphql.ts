
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
    currentUser(): Nullable<User> | Promise<Nullable<User>>;
    prepRun(): Nullable<RunParams> | Promise<Nullable<RunParams>>;
}

export interface IMutation {
    login(code: string): Nullable<Auth> | Promise<Nullable<Auth>>;
    refresh(token: string): Nullable<Auth> | Promise<Nullable<Auth>>;
    createRun(token: string, startDate: string, endDate: string, startTime: string, endTime: string): Nullable<Run> | Promise<Nullable<Run>>;
    createEvent(event: string, payload?: Nullable<string>): Nullable<AnalyticsEvent> | Promise<Nullable<AnalyticsEvent>>;
    addSleepVariable(name: string, emoji: string, custom: boolean, sleepDate: string): Nullable<SleepVariable> | Promise<Nullable<SleepVariable>>;
    removeSleepVariable(name: string, sleepDate: string): Nullable<string> | Promise<Nullable<string>>;
    updateExperienceLevel(): Nullable<ExperienceLevel> | Promise<Nullable<ExperienceLevel>>;
    completeOnboarding(experience: ExperienceLevel, firstName: string, lastName: string, dob: string): Nullable<User> | Promise<Nullable<User>>;
    updateDefaultRunDuration(duration: number): number | Promise<number>;
    markFeatureSeen(feature: string): Nullable<string>[] | Promise<Nullable<string>[]>;
    updateProfile(firstName: string, lastName: string, dob: string): Nullable<User> | Promise<Nullable<User>>;
    sendFriendRequest(friendId: string): Nullable<boolean> | Promise<Nullable<boolean>>;
    acceptFriendRequest(friendId: string): PublicUser | Promise<PublicUser>;
    rejectFriendRequest(friendId: string): string | Promise<string>;
    updateRunParams(intensityFeedBack: number): Nullable<User> | Promise<Nullable<User>>;
    updateProfilePic(avatarUrl: string): Nullable<User> | Promise<Nullable<User>>;
    createSleepVariable(emoji: string, name: string): SleepVariable | Promise<SleepVariable>;
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
}

export interface SleepVariable {
    name: string;
    emoji?: Nullable<string>;
    custom: boolean;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    experience?: Nullable<ExperienceLevel>;
    stage: AccountStage;
    runs?: Nullable<Nullable<Run>[]>;
    maxHr: number;
    dob: string;
    defaultRunDuration: number;
    features: Nullable<string>[];
    avatarUrl: string;
    createdAtUTS: number;
    utcOffset: number;
    xp: number;
    friends: Nullable<PublicUser>[];
    friendRequests: Nullable<PublicUser>[];
    currentRunParams: RunParams;
    todaysSleep?: Nullable<Sleep>;
    sleepVariables?: Nullable<Nullable<SleepVariable>[]>;
}

export interface RunParams {
    highIntensity?: Nullable<number>;
    lowIntensity?: Nullable<number>;
    repetitions?: Nullable<number>;
    sets?: Nullable<number>;
    restPeriod?: Nullable<number>;
}

export interface PublicUser {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    xp: number;
}

type Nullable<T> = T | null;
