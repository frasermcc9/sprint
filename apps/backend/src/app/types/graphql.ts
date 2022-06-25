
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
}

export interface IMutation {
    login(code: string): Nullable<Auth> | Promise<Nullable<Auth>>;
    refresh(token: string): Nullable<Auth> | Promise<Nullable<Auth>>;
    createEvent(event: string, payload?: Nullable<string>): Nullable<AnalyticsEvent> | Promise<Nullable<AnalyticsEvent>>;
    updateExperienceLevel(): Nullable<ExperienceLevel> | Promise<Nullable<ExperienceLevel>>;
    completeOnboarding(experience: ExperienceLevel, firstName: string, lastName: string, dob: string): Nullable<User> | Promise<Nullable<User>>;
    updateDefaultRunDuration(duration: number): number | Promise<number>;
    markFeatureSeen(feature: string): Nullable<string>[] | Promise<Nullable<string>[]>;
    updateProfile(firstName: string, lastName: string, dob: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface Run {
    userId?: Nullable<string>;
    date?: Nullable<string>;
    duration?: Nullable<number>;
    distance?: Nullable<number>;
    heartRate?: Nullable<Nullable<number>[]>;
    speed?: Nullable<Nullable<number>[]>;
    vo2max?: Nullable<number>;
    intensityFeedback?: Nullable<number>;
}

export interface AnalyticsEvent {
    user: string;
    event: string;
    payload?: Nullable<string>;
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
}

type Nullable<T> = T | null;
