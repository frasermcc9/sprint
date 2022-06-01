
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
    updateExperienceLevel(): Nullable<ExperienceLevel> | Promise<Nullable<ExperienceLevel>>;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
}

type Nullable<T> = T | null;
