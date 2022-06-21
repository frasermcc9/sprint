import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import Streaks from "../streaks";

export interface HomeHeaderProps {
  useController: typeof useHomeHeaderController;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ useController }) => {
  return (
    <div className="my-2 flex h-8 w-full flex-row justify-around">
      <div className="relative h-8 w-8">
        <CircularProgressbar
          value={83}
          styles={{
            path: {
              stroke: "rgb(79 70 229)",
            },
          }}
        />
        <div className="font-palanquin absolute top-0 left-0 flex h-full w-full items-center justify-center">
          <span className="pb-0.5 font-bold">23</span>
        </div>
      </div>
      <div>
        <Streaks streakSize={4} />
      </div>
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
