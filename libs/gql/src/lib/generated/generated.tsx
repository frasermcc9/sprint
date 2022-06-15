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
  markFeatureSeen: Array<Maybe<Scalars['String']>>;
  refresh?: Maybe<Auth>;
  updateDefaultRunDuration: Scalars['Int'];
  updateExperienceLevel?: Maybe<ExperienceLevel>;
};


export type MutationCompleteOnboardingArgs = {
  dob: Scalars['String'];
  experience: ExperienceLevel;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};


export type MutationLoginArgs = {
  code: Scalars['String'];
};


export type MutationMarkFeatureSeenArgs = {
  feature: Scalars['String'];
};


export type MutationRefreshArgs = {
  token: Scalars['String'];
};


export type MutationUpdateDefaultRunDurationArgs = {
  duration: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  getAuthLink: Scalars['String'];
  testAuth?: Maybe<Scalars['String']>;
};

export type Run = {
  __typename?: 'Run';
  date?: Maybe<Scalars['String']>;
  distance?: Maybe<Scalars['Int']>;
  duration?: Maybe<Scalars['Int']>;
  heartRate?: Maybe<Array<Maybe<Scalars['Int']>>>;
  intensityFeedback?: Maybe<Scalars['Int']>;
  speed?: Maybe<Array<Maybe<Scalars['Int']>>>;
  userId?: Maybe<Scalars['String']>;
  vo2max?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  defaultRunDuration: Scalars['Int'];
  dob: Scalars['String'];
  experience?: Maybe<ExperienceLevel>;
  features: Array<Maybe<Scalars['String']>>;
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  maxHr: Scalars['Int'];
  runs?: Maybe<Array<Maybe<Run>>>;
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


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, firstName: string, lastName: string, experience?: ExperienceLevel | null, stage: AccountStage, maxHr: number, dob: string, defaultRunDuration: number } | null };

export type FeaturesSeenQueryVariables = Exact<{ [key: string]: never; }>;


export type FeaturesSeenQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, features: Array<string | null> } | null };

export type UpdateDefaultRunDurationMutationVariables = Exact<{
  duration: Scalars['Int'];
}>;


export type UpdateDefaultRunDurationMutation = { __typename?: 'Mutation', updateDefaultRunDuration: number };

export type MarkFeatureSeenMutationVariables = Exact<{
  feature: Scalars['String'];
}>;


export type MarkFeatureSeenMutation = { __typename?: 'Mutation', markFeatureSeen: Array<string | null> };

export type CompleteOnboardingMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  experience: ExperienceLevel;
  dob: Scalars['String'];
}>;


export type CompleteOnboardingMutation = { __typename?: 'Mutation', completeOnboarding?: { __typename?: 'User', id: string, firstName: string, lastName: string, experience?: ExperienceLevel | null, stage: AccountStage, dob: string } | null };


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
    maxHr
    dob
    defaultRunDuration
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
export const FeaturesSeenDocument = gql`
    query FeaturesSeen {
  currentUser {
    id
    features
  }
}
    `;

/**
 * __useFeaturesSeenQuery__
 *
 * To run a query within a React component, call `useFeaturesSeenQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeaturesSeenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeaturesSeenQuery({
 *   variables: {
 *   },
 * });
 */
export function useFeaturesSeenQuery(baseOptions?: Apollo.QueryHookOptions<FeaturesSeenQuery, FeaturesSeenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FeaturesSeenQuery, FeaturesSeenQueryVariables>(FeaturesSeenDocument, options);
      }
export function useFeaturesSeenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeaturesSeenQuery, FeaturesSeenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FeaturesSeenQuery, FeaturesSeenQueryVariables>(FeaturesSeenDocument, options);
        }
export type FeaturesSeenQueryHookResult = ReturnType<typeof useFeaturesSeenQuery>;
export type FeaturesSeenLazyQueryHookResult = ReturnType<typeof useFeaturesSeenLazyQuery>;
export type FeaturesSeenQueryResult = Apollo.QueryResult<FeaturesSeenQuery, FeaturesSeenQueryVariables>;
export const UpdateDefaultRunDurationDocument = gql`
    mutation UpdateDefaultRunDuration($duration: Int!) {
  updateDefaultRunDuration(duration: $duration)
}
    `;
export type UpdateDefaultRunDurationMutationFn = Apollo.MutationFunction<UpdateDefaultRunDurationMutation, UpdateDefaultRunDurationMutationVariables>;

/**
 * __useUpdateDefaultRunDurationMutation__
 *
 * To run a mutation, you first call `useUpdateDefaultRunDurationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDefaultRunDurationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDefaultRunDurationMutation, { data, loading, error }] = useUpdateDefaultRunDurationMutation({
 *   variables: {
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useUpdateDefaultRunDurationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDefaultRunDurationMutation, UpdateDefaultRunDurationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDefaultRunDurationMutation, UpdateDefaultRunDurationMutationVariables>(UpdateDefaultRunDurationDocument, options);
      }
export type UpdateDefaultRunDurationMutationHookResult = ReturnType<typeof useUpdateDefaultRunDurationMutation>;
export type UpdateDefaultRunDurationMutationResult = Apollo.MutationResult<UpdateDefaultRunDurationMutation>;
export type UpdateDefaultRunDurationMutationOptions = Apollo.BaseMutationOptions<UpdateDefaultRunDurationMutation, UpdateDefaultRunDurationMutationVariables>;
export const MarkFeatureSeenDocument = gql`
    mutation MarkFeatureSeen($feature: String!) {
  markFeatureSeen(feature: $feature)
}
    `;
export type MarkFeatureSeenMutationFn = Apollo.MutationFunction<MarkFeatureSeenMutation, MarkFeatureSeenMutationVariables>;

/**
 * __useMarkFeatureSeenMutation__
 *
 * To run a mutation, you first call `useMarkFeatureSeenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkFeatureSeenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markFeatureSeenMutation, { data, loading, error }] = useMarkFeatureSeenMutation({
 *   variables: {
 *      feature: // value for 'feature'
 *   },
 * });
 */
export function useMarkFeatureSeenMutation(baseOptions?: Apollo.MutationHookOptions<MarkFeatureSeenMutation, MarkFeatureSeenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkFeatureSeenMutation, MarkFeatureSeenMutationVariables>(MarkFeatureSeenDocument, options);
      }
export type MarkFeatureSeenMutationHookResult = ReturnType<typeof useMarkFeatureSeenMutation>;
export type MarkFeatureSeenMutationResult = Apollo.MutationResult<MarkFeatureSeenMutation>;
export type MarkFeatureSeenMutationOptions = Apollo.BaseMutationOptions<MarkFeatureSeenMutation, MarkFeatureSeenMutationVariables>;
export const CompleteOnboardingDocument = gql`
    mutation CompleteOnboarding($firstName: String!, $lastName: String!, $experience: ExperienceLevel!, $dob: String!) {
  completeOnboarding(
    experience: $experience
    firstName: $firstName
    lastName: $lastName
    dob: $dob
  ) {
    id
    firstName
    lastName
    experience
    stage
    dob
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
 *      dob: // value for 'dob'
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