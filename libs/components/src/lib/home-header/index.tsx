import React from "react";
import { StreakPopover } from "../streaks";
import { useXpPopupController, XpPopup } from "../xp-meter";
import { InRun, useCurrentUserQuery } from "@sprint/gql";
import RunPageHeader from "../run-page-header";

export interface HomeHeaderProps {
  useController: typeof useHomeHeaderController;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ useController }) => {
  const { data, loading, error } = useCurrentUserQuery();
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!data) return <div>No data</div>;

  let runStreak = 0;
  if (data?.currentUser?.runTrackStreak) {
    runStreak = data.currentUser.runTrackStreak;
  }

  return (
    <div className="relative my-2 flex h-8 w-full flex-row justify-around">
      <XpPopup useController={useXpPopupController} />
      {data.currentUser?.inRun === InRun.Yes && <RunPageHeader />}
      <StreakPopover
        streakSize={runStreak}
        days={[false, true, false, false, true]}
      />
    </div>
  );
};

export const useHomeHeaderController = () => {
  return {};
};

export const useMockHomeHeaderController: typeof useHomeHeaderController =
  () => {
    return {};
  };

export default HomeHeader;
