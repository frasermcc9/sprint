import { useCurrentUserQuery, useGetSleepLeaderboardQuery } from "@sprint/gql";
import classNames from "classnames";
import React, { useMemo } from "react";
import { useSleepColors } from "../hooks";

export interface LeaderboardProps {
  useController: typeof useLeaderboardController;
}

const Header: React.FC<LeaderboardProps> = ({ useController }) => {
  const { loading, sleepScores } = useController();

  const applyColor = useSleepColors();

  const topScores = sleepScores?.slice(0, 3) ?? [];
  // const topScores = new Array(3).fill(sleepScores?.[0], 0);

  const UserDisplay = ({
    user,
    rank,
  }: {
    user: { avatarUrl: string };
    rank: number;
  }) => {
    return (
      <div className="relative rounded-xl">
        <img
          src={user.avatarUrl}
          className={classNames("rounded-full border-4 border-white", {
            "h-24": rank === 0,
            "h-20": rank !== 0,
          })}
          alt="avatar"
        />
        <div
          className={classNames(
            "absolute left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-4 items-center justify-center rounded-full",
            {
              "bg-amber-500": rank === 0,
              "bg-indigo-500": rank === 1,
              "bg-rose-500": rank === 2,
            },
          )}
        >
          <div className="pb-0.5 text-lg font-bold">{rank + 1}</div>
        </div>
      </div>
    );
  };

  const UserNameDisplay = ({
    user,
  }: {
    user: { firstName: string; lastName: string; shareableSleepScore: number };
  }) => {
    return (
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="leading-tight">{user.firstName}</div>
          <div className="leading-tight">{user.lastName}</div>
        </div>
        <div className="mx-auto h-0.5 w-3/4 bg-white" />
        <div className="mx-auto -mt-2 text-2xl font-bold">
          {applyColor(user.shareableSleepScore)}
        </div>
      </div>
    );
  };

  return (
    <>
      {loading && (
        <div className="mx-auto flex flex-col gap-y-2">
          <div>Loading...</div>
        </div>
      )}
      {!loading && (
        <div className="flex w-full flex-col gap-y-8">
          <div className="flex w-full items-center justify-around px-4">
            {topScores[1] && <UserDisplay user={topScores[1]} rank={1} />}
            {topScores[0] && <UserDisplay user={topScores[0]} rank={0} />}
            {topScores[2] && <UserDisplay user={topScores[2]} rank={2} />}
          </div>
          <div className="flex w-full items-center justify-around px-4">
            {topScores[1] && <UserNameDisplay user={topScores[1]} />}
            {topScores[0] && <UserNameDisplay user={topScores[0]} />}
            {topScores[2] && <UserNameDisplay user={topScores[2]} />}
          </div>
        </div>
      )}
    </>
  );
};

const List: React.FC<LeaderboardProps> = ({ useController }) => {
  const { loading, sleepScores } = useController();
  const afterTopThree = sleepScores.slice(3);

  const applyColor = useSleepColors();

  const UserDisplay = ({
    rank,
    user: { avatarUrl, firstName, lastName, shareableSleepScore },
  }: {
    user: {
      firstName: string;
      lastName: string;
      avatarUrl: string;
      shareableSleepScore: number;
    };
    rank: number;
  }) => {
    return (
      <div className="font-palanquin flex items-center gap-x-4">
        <div className="w-4 font-bold text-gray-500">{rank}</div>
        <div className="flex items-center gap-x-2">
          <img
            src={avatarUrl}
            className={classNames("w-20 rounded-full")}
            alt="avatar"
          />
          <div className="font-bold text-gray-700">
            {firstName} {lastName}
          </div>
        </div>
        <div className="ml-auto mr-8 text-xl font-bold">
          {applyColor(shareableSleepScore)}
        </div>
      </div>
    );
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-1">
          {afterTopThree.map(
            (user, index) =>
              user && <UserDisplay user={user} rank={index + 4} />,
          )}
        </div>
      )}
    </div>
  );
};

export const useLeaderboardController = () => {
  const { loading: l1, data: friendData } = useGetSleepLeaderboardQuery();
  const { loading: l2, data: userData } = useCurrentUserQuery();

  const loading = l1 || l2;

  const ordered = useMemo(() => {
    const friendDataList = friendData?.currentUser?.friends ?? [];
    const userDataList = userData?.currentUser;

    if (loading) return [];
    const joined = [...friendDataList, userDataList];

    return joined
      .sort((a, b) => b!.shareableSleepScore - a!.shareableSleepScore)
      .slice(0, 10);
  }, [friendData?.currentUser?.friends, loading, userData?.currentUser]);

  return { loading, sleepScores: ordered };
};

export const LeaderboardComponents = {
  Header,
  List,
};
