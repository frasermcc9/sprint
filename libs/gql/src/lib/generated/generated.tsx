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

export type AnalyticsEvent = {
  __typename?: 'AnalyticsEvent';
  event: Scalars['String'];
  payload?: Maybe<Scalars['String']>;
  user: Scalars['ID'];
};

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
  acceptFriendRequest: PublicUser;
  addSleepVariable?: Maybe<VariableEditResponse>;
  completeOnboarding?: Maybe<User>;
  createEvent?: Maybe<AnalyticsEvent>;
  createSleepVariable: SleepVariable;
  login?: Maybe<Auth>;
  markFeatureSeen: Array<Maybe<Scalars['String']>>;
  refresh?: Maybe<Auth>;
  rejectFriendRequest: Scalars['ID'];
  removeSleepVariable?: Maybe<VariableEditResponse>;
  sendFriendRequest?: Maybe<Scalars['Boolean']>;
  trackVariable: Array<Scalars['String']>;
  untrackVariable: Array<Scalars['String']>;
  updateDefaultRunDuration: Scalars['Int'];
  updateEmblem: Scalars['String'];
  updateExperienceLevel?: Maybe<ExperienceLevel>;
  updateProfile?: Maybe<User>;
  updateProfilePic?: Maybe<User>;
  updateRunParams?: Maybe<User>;
};


export type MutationAcceptFriendRequestArgs = {
  friendId: Scalars['ID'];
};


export type MutationAddSleepVariableArgs = {
  custom: Scalars['Boolean'];
  emoji: Scalars['String'];
  name: Scalars['String'];
  sleepDate: Scalars['String'];
};


export type MutationCompleteOnboardingArgs = {
  dob: Scalars['String'];
  experience: ExperienceLevel;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};


export type MutationCreateEventArgs = {
  event: Scalars['String'];
  payload?: InputMaybe<Scalars['String']>;
};


export type MutationCreateSleepVariableArgs = {
  emoji: Scalars['String'];
  name: Scalars['String'];
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


export type MutationRejectFriendRequestArgs = {
  friendId: Scalars['ID'];
};


export type MutationRemoveSleepVariableArgs = {
  name: Scalars['String'];
  sleepDate: Scalars['String'];
};


export type MutationSendFriendRequestArgs = {
  friendId: Scalars['ID'];
};


export type MutationTrackVariableArgs = {
  name: Scalars['String'];
};


export type MutationUntrackVariableArgs = {
  name: Scalars['String'];
};


export type MutationUpdateDefaultRunDurationArgs = {
  duration: Scalars['Int'];
};


export type MutationUpdateEmblemArgs = {
  emblem: Scalars['String'];
};


export type MutationUpdateProfileArgs = {
  dob: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};


export type MutationUpdateProfilePicArgs = {
  avatarUrl: Scalars['String'];
};


export type MutationUpdateRunParamsArgs = {
  intensityFeedBack: Scalars['Int'];
};

export type PublicUser = {
  __typename?: 'PublicUser';
  avatarUrl: Scalars['String'];
  emblem: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  xp: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  analyzeSleep?: Maybe<SleepAnalysis>;
  currentUser?: Maybe<User>;
  getAuthLink: Scalars['String'];
  prepRun?: Maybe<RunParams>;
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

export type RunParams = {
  __typename?: 'RunParams';
  highIntensity?: Maybe<Scalars['Int']>;
  lowIntensity?: Maybe<Scalars['Int']>;
  repetitions?: Maybe<Scalars['Int']>;
  restPeriod?: Maybe<Scalars['Int']>;
  sets?: Maybe<Scalars['Int']>;
};

export type Sleep = {
  __typename?: 'Sleep';
  awake: Scalars['Int'];
  awakenings: Scalars['Int'];
  date: Scalars['String'];
  deep: Scalars['Int'];
  light: Scalars['Int'];
  ownerId: Scalars['ID'];
  rem: Scalars['Int'];
  score: Scalars['Int'];
  tomorrow: Scalars['String'];
  variables?: Maybe<Array<Maybe<SleepVariable>>>;
  yesterday: Scalars['String'];
};

export type SleepAnalysis = {
  __typename?: 'SleepAnalysis';
  components: Array<SleepAnalysisComponent>;
  regressionIntercept: Scalars['Float'];
};

export type SleepAnalysisComponent = {
  __typename?: 'SleepAnalysisComponent';
  regressionGradient: Scalars['Float'];
  variable: Scalars['String'];
};

export type SleepVariable = {
  __typename?: 'SleepVariable';
  custom: Scalars['Boolean'];
  emoji?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  availableEmblems: Array<Scalars['String']>;
  avatarUrl: Scalars['String'];
  createdAtUTS: Scalars['Float'];
  currentRunParams: RunParams;
  defaultRunDuration: Scalars['Int'];
  dob: Scalars['String'];
  emblem: Scalars['String'];
  experience?: Maybe<ExperienceLevel>;
  features: Array<Maybe<Scalars['String']>>;
  firstName: Scalars['String'];
  friendRequests: Array<Maybe<PublicUser>>;
  friends: Array<Maybe<PublicUser>>;
  id: Scalars['String'];
  lastName: Scalars['String'];
  maxHr: Scalars['Int'];
  runs?: Maybe<Array<Maybe<Run>>>;
  sleepVariables?: Maybe<Array<Maybe<SleepVariable>>>;
  stage: AccountStage;
  todaysSleep: Array<Maybe<Sleep>>;
  trackedVariables: Array<Scalars['String']>;
  utcOffset: Scalars['Float'];
  xp: Scalars['Int'];
};


export type UserFriendsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type UserTodaysSleepArgs = {
  sourceUrl?: InputMaybe<Scalars['String']>;
};

export type VariableEditResponse = {
  __typename?: 'VariableEditResponse';
  date: Scalars['String'];
  variables: Array<Maybe<SleepVariable>>;
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

export type AnalyticsObservationMutationVariables = Exact<{
  event: Scalars['String'];
  payload?: InputMaybe<Scalars['String']>;
}>;


export type AnalyticsObservationMutation = { __typename?: 'Mutation', createEvent?: { __typename?: 'AnalyticsEvent', user: string, event: string, payload?: string | null } | null };

export type MostRecentSleepQueryVariables = Exact<{
  sourceUrl?: InputMaybe<Scalars['String']>;
}>;


export type MostRecentSleepQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, todaysSleep: Array<{ __typename?: 'Sleep', awake: number, rem: number, light: number, deep: number, awakenings: number, score: number, date: string, tomorrow: string, yesterday: string, variables?: Array<{ __typename?: 'SleepVariable', name: string, emoji?: string | null, custom: boolean } | null> | null } | null> } | null };

export type CustomSleepVariablesQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomSleepVariablesQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, trackedVariables: Array<string>, sleepVariables?: Array<{ __typename?: 'SleepVariable', name: string, emoji?: string | null, custom: boolean } | null> | null } | null };

export type AddSleepVariableMutationVariables = Exact<{
  name: Scalars['String'];
  emoji: Scalars['String'];
  sleepDate: Scalars['String'];
  custom: Scalars['Boolean'];
}>;


export type AddSleepVariableMutation = { __typename?: 'Mutation', addSleepVariable?: { __typename?: 'VariableEditResponse', date: string, variables: Array<{ __typename?: 'SleepVariable', name: string, emoji?: string | null, custom: boolean } | null> } | null };

export type RemoveSleepVariableMutationVariables = Exact<{
  name: Scalars['String'];
  sleepDate: Scalars['String'];
}>;


export type RemoveSleepVariableMutation = { __typename?: 'Mutation', removeSleepVariable?: { __typename?: 'VariableEditResponse', date: string, variables: Array<{ __typename?: 'SleepVariable', name: string, emoji?: string | null, custom: boolean } | null> } | null };

export type TrackVariableMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type TrackVariableMutation = { __typename?: 'Mutation', trackVariable: Array<string> };

export type UntrackVariableMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type UntrackVariableMutation = { __typename?: 'Mutation', untrackVariable: Array<string> };

export type AnalyzeSleepQueryVariables = Exact<{ [key: string]: never; }>;


export type AnalyzeSleepQuery = { __typename?: 'Query', analyzeSleep?: { __typename?: 'SleepAnalysis', regressionIntercept: number, components: Array<{ __typename?: 'SleepAnalysisComponent', variable: string, regressionGradient: number }> } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, firstName: string, lastName: string, experience?: ExperienceLevel | null, stage: AccountStage, maxHr: number, dob: string, defaultRunDuration: number, createdAtUTS: number, avatarUrl: string, xp: number, emblem: string } | null };

export type FeaturesSeenQueryVariables = Exact<{ [key: string]: never; }>;


export type FeaturesSeenQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, features: Array<string | null> } | null };

export type GetFriendsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetFriendsQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, friends: Array<{ __typename?: 'PublicUser', id: string, firstName: string, lastName: string, avatarUrl: string, xp: number, emblem: string } | null>, friendRequests: Array<{ __typename?: 'PublicUser', id: string, firstName: string, lastName: string, avatarUrl: string, xp: number, emblem: string } | null> } | null };

export type GetAvailableEmblemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableEmblemsQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, availableEmblems: Array<string> } | null };

export type UpdateDefaultRunDurationMutationVariables = Exact<{
  duration: Scalars['Int'];
}>;


export type UpdateDefaultRunDurationMutation = { __typename?: 'Mutation', updateDefaultRunDuration: number };

export type MarkFeatureSeenMutationVariables = Exact<{
  feature: Scalars['String'];
}>;


export type MarkFeatureSeenMutation = { __typename?: 'Mutation', markFeatureSeen: Array<string | null> };

export type SendFriendRequestMutationVariables = Exact<{
  friendId: Scalars['ID'];
}>;


export type SendFriendRequestMutation = { __typename?: 'Mutation', sendFriendRequest?: boolean | null };

export type AcceptFriendRequestMutationVariables = Exact<{
  friendId: Scalars['ID'];
}>;


export type AcceptFriendRequestMutation = { __typename?: 'Mutation', acceptFriendRequest: { __typename?: 'PublicUser', id: string, firstName: string, lastName: string, avatarUrl: string, xp: number } };

export type RejectFriendRequestMutationVariables = Exact<{
  friendId: Scalars['ID'];
}>;


export type RejectFriendRequestMutation = { __typename?: 'Mutation', rejectFriendRequest: string };

export type CompleteOnboardingMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  experience: ExperienceLevel;
  dob: Scalars['String'];
}>;


export type CompleteOnboardingMutation = { __typename?: 'Mutation', completeOnboarding?: { __typename?: 'User', id: string, firstName: string, lastName: string, experience?: ExperienceLevel | null, stage: AccountStage, dob: string } | null };

export type UpdateProfileMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  dob: Scalars['String'];
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile?: { __typename?: 'User', firstName: string, lastName: string, dob: string } | null };

export type UpdateProfilePicMutationVariables = Exact<{
  avatarUrl: Scalars['String'];
}>;


export type UpdateProfilePicMutation = { __typename?: 'Mutation', updateProfilePic?: { __typename?: 'User', avatarUrl: string } | null };

export type UpdateEmblemMutationVariables = Exact<{
  emblem: Scalars['String'];
}>;


export type UpdateEmblemMutation = { __typename?: 'Mutation', updateEmblem: string };

export type CreateSleepVariableMutationVariables = Exact<{
  name: Scalars['String'];
  emoji: Scalars['String'];
}>;


export type CreateSleepVariableMutation = { __typename?: 'Mutation', createSleepVariable: { __typename?: 'SleepVariable', name: string, emoji?: string | null, custom: boolean } };


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
export const AnalyticsObservationDocument = gql`
    mutation AnalyticsObservation($event: String!, $payload: String) {
  createEvent(event: $event, payload: $payload) {
    user
    event
    payload
  }
}
    `;
export type AnalyticsObservationMutationFn = Apollo.MutationFunction<AnalyticsObservationMutation, AnalyticsObservationMutationVariables>;

/**
 * __useAnalyticsObservationMutation__
 *
 * To run a mutation, you first call `useAnalyticsObservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnalyticsObservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [analyticsObservationMutation, { data, loading, error }] = useAnalyticsObservationMutation({
 *   variables: {
 *      event: // value for 'event'
 *      payload: // value for 'payload'
 *   },
 * });
 */
export function useAnalyticsObservationMutation(baseOptions?: Apollo.MutationHookOptions<AnalyticsObservationMutation, AnalyticsObservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AnalyticsObservationMutation, AnalyticsObservationMutationVariables>(AnalyticsObservationDocument, options);
      }
export type AnalyticsObservationMutationHookResult = ReturnType<typeof useAnalyticsObservationMutation>;
export type AnalyticsObservationMutationResult = Apollo.MutationResult<AnalyticsObservationMutation>;
export type AnalyticsObservationMutationOptions = Apollo.BaseMutationOptions<AnalyticsObservationMutation, AnalyticsObservationMutationVariables>;
export const MostRecentSleepDocument = gql`
    query MostRecentSleep($sourceUrl: String) {
  currentUser {
    id
    todaysSleep(sourceUrl: $sourceUrl) {
      awake
      rem
      light
      deep
      awakenings
      score
      date
      variables {
        name
        emoji
        custom
      }
      tomorrow
      yesterday
    }
  }
}
    `;

/**
 * __useMostRecentSleepQuery__
 *
 * To run a query within a React component, call `useMostRecentSleepQuery` and pass it any options that fit your needs.
 * When your component renders, `useMostRecentSleepQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMostRecentSleepQuery({
 *   variables: {
 *      sourceUrl: // value for 'sourceUrl'
 *   },
 * });
 */
export function useMostRecentSleepQuery(baseOptions?: Apollo.QueryHookOptions<MostRecentSleepQuery, MostRecentSleepQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MostRecentSleepQuery, MostRecentSleepQueryVariables>(MostRecentSleepDocument, options);
      }
export function useMostRecentSleepLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MostRecentSleepQuery, MostRecentSleepQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MostRecentSleepQuery, MostRecentSleepQueryVariables>(MostRecentSleepDocument, options);
        }
export type MostRecentSleepQueryHookResult = ReturnType<typeof useMostRecentSleepQuery>;
export type MostRecentSleepLazyQueryHookResult = ReturnType<typeof useMostRecentSleepLazyQuery>;
export type MostRecentSleepQueryResult = Apollo.QueryResult<MostRecentSleepQuery, MostRecentSleepQueryVariables>;
export const CustomSleepVariablesDocument = gql`
    query CustomSleepVariables {
  currentUser {
    id
    sleepVariables {
      name
      emoji
      custom
    }
    trackedVariables
  }
}
    `;

/**
 * __useCustomSleepVariablesQuery__
 *
 * To run a query within a React component, call `useCustomSleepVariablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomSleepVariablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomSleepVariablesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCustomSleepVariablesQuery(baseOptions?: Apollo.QueryHookOptions<CustomSleepVariablesQuery, CustomSleepVariablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomSleepVariablesQuery, CustomSleepVariablesQueryVariables>(CustomSleepVariablesDocument, options);
      }
export function useCustomSleepVariablesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomSleepVariablesQuery, CustomSleepVariablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomSleepVariablesQuery, CustomSleepVariablesQueryVariables>(CustomSleepVariablesDocument, options);
        }
export type CustomSleepVariablesQueryHookResult = ReturnType<typeof useCustomSleepVariablesQuery>;
export type CustomSleepVariablesLazyQueryHookResult = ReturnType<typeof useCustomSleepVariablesLazyQuery>;
export type CustomSleepVariablesQueryResult = Apollo.QueryResult<CustomSleepVariablesQuery, CustomSleepVariablesQueryVariables>;
export const AddSleepVariableDocument = gql`
    mutation AddSleepVariable($name: String!, $emoji: String!, $sleepDate: String!, $custom: Boolean!) {
  addSleepVariable(
    custom: $custom
    emoji: $emoji
    name: $name
    sleepDate: $sleepDate
  ) {
    date
    variables {
      name
      emoji
      custom
    }
  }
}
    `;
export type AddSleepVariableMutationFn = Apollo.MutationFunction<AddSleepVariableMutation, AddSleepVariableMutationVariables>;

/**
 * __useAddSleepVariableMutation__
 *
 * To run a mutation, you first call `useAddSleepVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSleepVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSleepVariableMutation, { data, loading, error }] = useAddSleepVariableMutation({
 *   variables: {
 *      name: // value for 'name'
 *      emoji: // value for 'emoji'
 *      sleepDate: // value for 'sleepDate'
 *      custom: // value for 'custom'
 *   },
 * });
 */
export function useAddSleepVariableMutation(baseOptions?: Apollo.MutationHookOptions<AddSleepVariableMutation, AddSleepVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddSleepVariableMutation, AddSleepVariableMutationVariables>(AddSleepVariableDocument, options);
      }
export type AddSleepVariableMutationHookResult = ReturnType<typeof useAddSleepVariableMutation>;
export type AddSleepVariableMutationResult = Apollo.MutationResult<AddSleepVariableMutation>;
export type AddSleepVariableMutationOptions = Apollo.BaseMutationOptions<AddSleepVariableMutation, AddSleepVariableMutationVariables>;
export const RemoveSleepVariableDocument = gql`
    mutation RemoveSleepVariable($name: String!, $sleepDate: String!) {
  removeSleepVariable(name: $name, sleepDate: $sleepDate) {
    date
    variables {
      name
      emoji
      custom
    }
  }
}
    `;
export type RemoveSleepVariableMutationFn = Apollo.MutationFunction<RemoveSleepVariableMutation, RemoveSleepVariableMutationVariables>;

/**
 * __useRemoveSleepVariableMutation__
 *
 * To run a mutation, you first call `useRemoveSleepVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSleepVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSleepVariableMutation, { data, loading, error }] = useRemoveSleepVariableMutation({
 *   variables: {
 *      name: // value for 'name'
 *      sleepDate: // value for 'sleepDate'
 *   },
 * });
 */
export function useRemoveSleepVariableMutation(baseOptions?: Apollo.MutationHookOptions<RemoveSleepVariableMutation, RemoveSleepVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveSleepVariableMutation, RemoveSleepVariableMutationVariables>(RemoveSleepVariableDocument, options);
      }
export type RemoveSleepVariableMutationHookResult = ReturnType<typeof useRemoveSleepVariableMutation>;
export type RemoveSleepVariableMutationResult = Apollo.MutationResult<RemoveSleepVariableMutation>;
export type RemoveSleepVariableMutationOptions = Apollo.BaseMutationOptions<RemoveSleepVariableMutation, RemoveSleepVariableMutationVariables>;
export const TrackVariableDocument = gql`
    mutation TrackVariable($name: String!) {
  trackVariable(name: $name)
}
    `;
export type TrackVariableMutationFn = Apollo.MutationFunction<TrackVariableMutation, TrackVariableMutationVariables>;

/**
 * __useTrackVariableMutation__
 *
 * To run a mutation, you first call `useTrackVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackVariableMutation, { data, loading, error }] = useTrackVariableMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useTrackVariableMutation(baseOptions?: Apollo.MutationHookOptions<TrackVariableMutation, TrackVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TrackVariableMutation, TrackVariableMutationVariables>(TrackVariableDocument, options);
      }
export type TrackVariableMutationHookResult = ReturnType<typeof useTrackVariableMutation>;
export type TrackVariableMutationResult = Apollo.MutationResult<TrackVariableMutation>;
export type TrackVariableMutationOptions = Apollo.BaseMutationOptions<TrackVariableMutation, TrackVariableMutationVariables>;
export const UntrackVariableDocument = gql`
    mutation UntrackVariable($name: String!) {
  untrackVariable(name: $name)
}
    `;
export type UntrackVariableMutationFn = Apollo.MutationFunction<UntrackVariableMutation, UntrackVariableMutationVariables>;

/**
 * __useUntrackVariableMutation__
 *
 * To run a mutation, you first call `useUntrackVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUntrackVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [untrackVariableMutation, { data, loading, error }] = useUntrackVariableMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUntrackVariableMutation(baseOptions?: Apollo.MutationHookOptions<UntrackVariableMutation, UntrackVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UntrackVariableMutation, UntrackVariableMutationVariables>(UntrackVariableDocument, options);
      }
export type UntrackVariableMutationHookResult = ReturnType<typeof useUntrackVariableMutation>;
export type UntrackVariableMutationResult = Apollo.MutationResult<UntrackVariableMutation>;
export type UntrackVariableMutationOptions = Apollo.BaseMutationOptions<UntrackVariableMutation, UntrackVariableMutationVariables>;
export const AnalyzeSleepDocument = gql`
    query AnalyzeSleep {
  analyzeSleep {
    components {
      variable
      regressionGradient
    }
    regressionIntercept
  }
}
    `;

/**
 * __useAnalyzeSleepQuery__
 *
 * To run a query within a React component, call `useAnalyzeSleepQuery` and pass it any options that fit your needs.
 * When your component renders, `useAnalyzeSleepQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAnalyzeSleepQuery({
 *   variables: {
 *   },
 * });
 */
export function useAnalyzeSleepQuery(baseOptions?: Apollo.QueryHookOptions<AnalyzeSleepQuery, AnalyzeSleepQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AnalyzeSleepQuery, AnalyzeSleepQueryVariables>(AnalyzeSleepDocument, options);
      }
export function useAnalyzeSleepLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AnalyzeSleepQuery, AnalyzeSleepQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AnalyzeSleepQuery, AnalyzeSleepQueryVariables>(AnalyzeSleepDocument, options);
        }
export type AnalyzeSleepQueryHookResult = ReturnType<typeof useAnalyzeSleepQuery>;
export type AnalyzeSleepLazyQueryHookResult = ReturnType<typeof useAnalyzeSleepLazyQuery>;
export type AnalyzeSleepQueryResult = Apollo.QueryResult<AnalyzeSleepQuery, AnalyzeSleepQueryVariables>;
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
    createdAtUTS
    avatarUrl
    createdAtUTS
    xp
    emblem
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
export const GetFriendsDocument = gql`
    query GetFriends($limit: Int) {
  currentUser {
    id
    friends(limit: $limit) {
      id
      firstName
      lastName
      avatarUrl
      xp
      emblem
    }
    friendRequests {
      id
      firstName
      lastName
      avatarUrl
      xp
      emblem
    }
  }
}
    `;

/**
 * __useGetFriendsQuery__
 *
 * To run a query within a React component, call `useGetFriendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFriendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFriendsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetFriendsQuery(baseOptions?: Apollo.QueryHookOptions<GetFriendsQuery, GetFriendsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument, options);
      }
export function useGetFriendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFriendsQuery, GetFriendsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument, options);
        }
export type GetFriendsQueryHookResult = ReturnType<typeof useGetFriendsQuery>;
export type GetFriendsLazyQueryHookResult = ReturnType<typeof useGetFriendsLazyQuery>;
export type GetFriendsQueryResult = Apollo.QueryResult<GetFriendsQuery, GetFriendsQueryVariables>;
export const GetAvailableEmblemsDocument = gql`
    query GetAvailableEmblems {
  currentUser {
    id
    availableEmblems
  }
}
    `;

/**
 * __useGetAvailableEmblemsQuery__
 *
 * To run a query within a React component, call `useGetAvailableEmblemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAvailableEmblemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAvailableEmblemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAvailableEmblemsQuery(baseOptions?: Apollo.QueryHookOptions<GetAvailableEmblemsQuery, GetAvailableEmblemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAvailableEmblemsQuery, GetAvailableEmblemsQueryVariables>(GetAvailableEmblemsDocument, options);
      }
export function useGetAvailableEmblemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAvailableEmblemsQuery, GetAvailableEmblemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAvailableEmblemsQuery, GetAvailableEmblemsQueryVariables>(GetAvailableEmblemsDocument, options);
        }
export type GetAvailableEmblemsQueryHookResult = ReturnType<typeof useGetAvailableEmblemsQuery>;
export type GetAvailableEmblemsLazyQueryHookResult = ReturnType<typeof useGetAvailableEmblemsLazyQuery>;
export type GetAvailableEmblemsQueryResult = Apollo.QueryResult<GetAvailableEmblemsQuery, GetAvailableEmblemsQueryVariables>;
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
export const SendFriendRequestDocument = gql`
    mutation sendFriendRequest($friendId: ID!) {
  sendFriendRequest(friendId: $friendId)
}
    `;
export type SendFriendRequestMutationFn = Apollo.MutationFunction<SendFriendRequestMutation, SendFriendRequestMutationVariables>;

/**
 * __useSendFriendRequestMutation__
 *
 * To run a mutation, you first call `useSendFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendFriendRequestMutation, { data, loading, error }] = useSendFriendRequestMutation({
 *   variables: {
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
export function useSendFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<SendFriendRequestMutation, SendFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendFriendRequestMutation, SendFriendRequestMutationVariables>(SendFriendRequestDocument, options);
      }
export type SendFriendRequestMutationHookResult = ReturnType<typeof useSendFriendRequestMutation>;
export type SendFriendRequestMutationResult = Apollo.MutationResult<SendFriendRequestMutation>;
export type SendFriendRequestMutationOptions = Apollo.BaseMutationOptions<SendFriendRequestMutation, SendFriendRequestMutationVariables>;
export const AcceptFriendRequestDocument = gql`
    mutation acceptFriendRequest($friendId: ID!) {
  acceptFriendRequest(friendId: $friendId) {
    id
    firstName
    lastName
    avatarUrl
    xp
  }
}
    `;
export type AcceptFriendRequestMutationFn = Apollo.MutationFunction<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>;

/**
 * __useAcceptFriendRequestMutation__
 *
 * To run a mutation, you first call `useAcceptFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptFriendRequestMutation, { data, loading, error }] = useAcceptFriendRequestMutation({
 *   variables: {
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
export function useAcceptFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>(AcceptFriendRequestDocument, options);
      }
export type AcceptFriendRequestMutationHookResult = ReturnType<typeof useAcceptFriendRequestMutation>;
export type AcceptFriendRequestMutationResult = Apollo.MutationResult<AcceptFriendRequestMutation>;
export type AcceptFriendRequestMutationOptions = Apollo.BaseMutationOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>;
export const RejectFriendRequestDocument = gql`
    mutation rejectFriendRequest($friendId: ID!) {
  rejectFriendRequest(friendId: $friendId)
}
    `;
export type RejectFriendRequestMutationFn = Apollo.MutationFunction<RejectFriendRequestMutation, RejectFriendRequestMutationVariables>;

/**
 * __useRejectFriendRequestMutation__
 *
 * To run a mutation, you first call `useRejectFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectFriendRequestMutation, { data, loading, error }] = useRejectFriendRequestMutation({
 *   variables: {
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
export function useRejectFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<RejectFriendRequestMutation, RejectFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectFriendRequestMutation, RejectFriendRequestMutationVariables>(RejectFriendRequestDocument, options);
      }
export type RejectFriendRequestMutationHookResult = ReturnType<typeof useRejectFriendRequestMutation>;
export type RejectFriendRequestMutationResult = Apollo.MutationResult<RejectFriendRequestMutation>;
export type RejectFriendRequestMutationOptions = Apollo.BaseMutationOptions<RejectFriendRequestMutation, RejectFriendRequestMutationVariables>;
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
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($firstName: String!, $lastName: String!, $dob: String!) {
  updateProfile(dob: $dob, firstName: $firstName, lastName: $lastName) {
    firstName
    lastName
    dob
  }
}
    `;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      dob: // value for 'dob'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const UpdateProfilePicDocument = gql`
    mutation updateProfilePic($avatarUrl: String!) {
  updateProfilePic(avatarUrl: $avatarUrl) {
    avatarUrl
  }
}
    `;
export type UpdateProfilePicMutationFn = Apollo.MutationFunction<UpdateProfilePicMutation, UpdateProfilePicMutationVariables>;

/**
 * __useUpdateProfilePicMutation__
 *
 * To run a mutation, you first call `useUpdateProfilePicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfilePicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfilePicMutation, { data, loading, error }] = useUpdateProfilePicMutation({
 *   variables: {
 *      avatarUrl: // value for 'avatarUrl'
 *   },
 * });
 */
export function useUpdateProfilePicMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfilePicMutation, UpdateProfilePicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfilePicMutation, UpdateProfilePicMutationVariables>(UpdateProfilePicDocument, options);
      }
export type UpdateProfilePicMutationHookResult = ReturnType<typeof useUpdateProfilePicMutation>;
export type UpdateProfilePicMutationResult = Apollo.MutationResult<UpdateProfilePicMutation>;
export type UpdateProfilePicMutationOptions = Apollo.BaseMutationOptions<UpdateProfilePicMutation, UpdateProfilePicMutationVariables>;
export const UpdateEmblemDocument = gql`
    mutation UpdateEmblem($emblem: String!) {
  updateEmblem(emblem: $emblem)
}
    `;
export type UpdateEmblemMutationFn = Apollo.MutationFunction<UpdateEmblemMutation, UpdateEmblemMutationVariables>;

/**
 * __useUpdateEmblemMutation__
 *
 * To run a mutation, you first call `useUpdateEmblemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmblemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmblemMutation, { data, loading, error }] = useUpdateEmblemMutation({
 *   variables: {
 *      emblem: // value for 'emblem'
 *   },
 * });
 */
export function useUpdateEmblemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEmblemMutation, UpdateEmblemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEmblemMutation, UpdateEmblemMutationVariables>(UpdateEmblemDocument, options);
      }
export type UpdateEmblemMutationHookResult = ReturnType<typeof useUpdateEmblemMutation>;
export type UpdateEmblemMutationResult = Apollo.MutationResult<UpdateEmblemMutation>;
export type UpdateEmblemMutationOptions = Apollo.BaseMutationOptions<UpdateEmblemMutation, UpdateEmblemMutationVariables>;
export const CreateSleepVariableDocument = gql`
    mutation CreateSleepVariable($name: String!, $emoji: String!) {
  createSleepVariable(emoji: $emoji, name: $name) {
    name
    emoji
    custom
  }
}
    `;
export type CreateSleepVariableMutationFn = Apollo.MutationFunction<CreateSleepVariableMutation, CreateSleepVariableMutationVariables>;

/**
 * __useCreateSleepVariableMutation__
 *
 * To run a mutation, you first call `useCreateSleepVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSleepVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSleepVariableMutation, { data, loading, error }] = useCreateSleepVariableMutation({
 *   variables: {
 *      name: // value for 'name'
 *      emoji: // value for 'emoji'
 *   },
 * });
 */
export function useCreateSleepVariableMutation(baseOptions?: Apollo.MutationHookOptions<CreateSleepVariableMutation, CreateSleepVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSleepVariableMutation, CreateSleepVariableMutationVariables>(CreateSleepVariableDocument, options);
      }
export type CreateSleepVariableMutationHookResult = ReturnType<typeof useCreateSleepVariableMutation>;
export type CreateSleepVariableMutationResult = Apollo.MutationResult<CreateSleepVariableMutation>;
export type CreateSleepVariableMutationOptions = Apollo.BaseMutationOptions<CreateSleepVariableMutation, CreateSleepVariableMutationVariables>;