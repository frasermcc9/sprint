import React from "react";

export interface LeaderboardProps {
  useController: typeof useLeaderboardController;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ useController }) => {
  const { loading } = useController();

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-800">
          Leaderboard
        </span>
      </div>
      <div className="mx-auto flex flex-col gap-y-2">
        {loading && <div>Loading...</div>}
      </div>
    </>
  );
};

export const useLeaderboardController = () => {
  return { loading: false };
};

export const useMockLeaderboardController: typeof useLeaderboardController =
  () => {
    return {
      loading: false,
    };
  };

export default Leaderboard;
