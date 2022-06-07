import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum AccountStage {
  ExperienceLevelSelected = 'EXPERIENCE_LEVEL_SELECTED',
  Initial = 'INITIAL',
  InitialRun = 'INITIAL_RUN'
}

export type Auth = {
  __typename?: 'Auth';
  access_token?: Maybe<Scalars['String']>;
  expires_in?: Maybe<Scalars['Int']>;
  refresh_token?: Maybe<Scalars['String']>;
  scope?: Maybe<Scalars['String']>;
  token_type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

export enum ExperienceLevel {
  Advanced = 'ADVANCED',
  Beginner = 'BEGINNER',
  Intermediate = 'INTERMEDIATE'
}

export type Mutation = {
  __typename?: 'Mutation';
  completeOnboarding?: Maybe<User>;
  login?: Maybe<Auth>;
  refresh?: Maybe<Auth>;
  updateExperienceLevel?: Maybe<ExperienceLevel>;
};


export type MutationCompleteOnboardingArgs = {
  experience: ExperienceLevel;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};


export type MutationLoginArgs = {
  code: Scalars['String'];
};


export type MutationRefreshArgs = {
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  getAuthLink: Scalars['String'];
  testAuth?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  experience?: Maybe<ExperienceLevel>;
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  stage: AccountStage;
};

export type LoginMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'Auth', access_token?: string | null, expires_in?: number | null, refresh_token?: string | null, user_id?: string | null } | null };

export type RefreshMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh?: { __typename?: 'Auth', access_token?: string | null, expires_in?: number | null, refresh_token?: string | null, user_id?: string | null } | null };

export type GetAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthUrlQuery = { __typename?: 'Query', getAuthLink: string };

export type TestAuthQueryVariables = Exact<{ [key: string]: never; }>;


export type TestAuthQuery = { __typename?: 'Query', testAuth?: string | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, firstName: string, lastName: string, experience?: ExperienceLevel | null, stage: AccountStage } | null };

export type CompleteOnboardingMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  experience: ExperienceLevel;
}>;


export type CompleteOnboardingMutation = { __typename?: 'Mutation', completeOnboarding?: { __typename?: 'User', id: string } | null };


export const LoginDocument = gql`
    mutation Login($code: String!) {
  login(code: $code) {
    access_token
    expires_in
    refresh_token
    user_id
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RefreshDocument = gql`
    mutation Refresh($token: String!) {
  refresh(token: $token) {
    access_token
    expires_in
    refresh_token
    user_id
  }
}
    `;
export type RefreshMutationFn = Apollo.MutationFunction<RefreshMutation, RefreshMutationVariables>;

/**
 * __useRefreshMutation__
 *
 * To run a mutation, you first call `useRefreshMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshMutation, { data, loading, error }] = useRefreshMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useRefreshMutation(baseOptions?: Apollo.MutationHookOptions<RefreshMutation, RefreshMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshMutation, RefreshMutationVariables>(RefreshDocument, options);
      }
export type RefreshMutationHookResult = ReturnType<typeof useRefreshMutation>;
export type RefreshMutationResult = Apollo.MutationResult<RefreshMutation>;
export type RefreshMutationOptions = Apollo.BaseMutationOptions<RefreshMutation, RefreshMutationVariables>;
export const GetAuthUrlDocument = gql`
    query GetAuthUrl {
  getAuthLink
}
    `;

/**
 * __useGetAuthUrlQuery__
 *
 * To run a query within a React component, call `useGetAuthUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAuthUrlQuery(baseOptions?: Apollo.QueryHookOptions<GetAuthUrlQuery, GetAuthUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuthUrlQuery, GetAuthUrlQueryVariables>(GetAuthUrlDocument, options);
      }
export function useGetAuthUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuthUrlQuery, GetAuthUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuthUrlQuery, GetAuthUrlQueryVariables>(GetAuthUrlDocument, options);
        }
export type GetAuthUrlQueryHookResult = ReturnType<typeof useGetAuthUrlQuery>;
export type GetAuthUrlLazyQueryHookResult = ReturnType<typeof useGetAuthUrlLazyQuery>;
export type GetAuthUrlQueryResult = Apollo.QueryResult<GetAuthUrlQuery, GetAuthUrlQueryVariables>;
export const TestAuthDocument = gql`
    query TestAuth {
  testAuth
}
    `;

/**
 * __useTestAuthQuery__
 *
 * To run a query within a React component, call `useTestAuthQuery` and pass it any options that fit your needs.
 * When your component renders, `useTestAuthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTestAuthQuery({
 *   variables: {
 *   },
 * });
 */
export function useTestAuthQuery(baseOptions?: Apollo.QueryHookOptions<TestAuthQuery, TestAuthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TestAuthQuery, TestAuthQueryVariables>(TestAuthDocument, options);
      }
export function useTestAuthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TestAuthQuery, TestAuthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TestAuthQuery, TestAuthQueryVariables>(TestAuthDocument, options);
        }
export type TestAuthQueryHookResult = ReturnType<typeof useTestAuthQuery>;
export type TestAuthLazyQueryHookResult = ReturnType<typeof useTestAuthLazyQuery>;
export type TestAuthQueryResult = Apollo.QueryResult<TestAuthQuery, TestAuthQueryVariables>;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    id
    firstName
    lastName
    experience
    stage
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const CompleteOnboardingDocument = gql`
    mutation CompleteOnboarding($firstName: String!, $lastName: String!, $experience: ExperienceLevel!) {
  completeOnboarding(
    experience: $experience
    firstName: $firstName
    lastName: $lastName
  ) {
    id
  }
}
    `;
export type CompleteOnboardingMutationFn = Apollo.MutationFunction<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>;

/**
 * __useCompleteOnboardingMutation__
 *
 * To run a mutation, you first call `useCompleteOnboardingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteOnboardingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeOnboardingMutation, { data, loading, error }] = useCompleteOnboardingMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      experience: // value for 'experience'
 *   },
 * });
 */
export function useCompleteOnboardingMutation(baseOptions?: Apollo.MutationHookOptions<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>(CompleteOnboardingDocument, options);
      }
export type CompleteOnboardingMutationHookResult = ReturnType<typeof useCompleteOnboardingMutation>;
export type CompleteOnboardingMutationResult = Apollo.MutationResult<CompleteOnboardingMutation>;
export type CompleteOnboardingMutationOptions = Apollo.BaseMutationOptions<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>;