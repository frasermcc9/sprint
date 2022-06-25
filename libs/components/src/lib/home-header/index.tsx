import React from "react";
import { StreakPopover } from "../streaks";
import { useXpPopupController, XpPopup } from "../xp-meter";

export interface HomeHeaderProps {
  useController: typeof useHomeHeaderController;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ useController }) => {
  return (
    <div className="relative my-2 flex h-8 w-full flex-row justify-around">
      <XpPopup useController={useXpPopupController} />
      <StreakPopover streakSize={4} days={[false, true, false, false, true]} />
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
