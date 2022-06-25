import { FireOff, FireOn } from "@sprint/assets";
import React from "react";
import Image from "next/image";

export interface StreaksProps {
  streakSize: number;
  todayCompleted: boolean;
}

export const Streaks: React.FC<StreaksProps> = ({
  streakSize,
  todayCompleted,
}) => {
  return (
    <div className="flex items-center" onClick={() => null}>
      <Image src={todayCompleted ? FireOn : FireOff} width={32} height={32} />
      <span className="font-palanquin pb-0.5 text-xl font-bold">
        {streakSize}
      </span>
    </div>
  );
};

export default Streaks;
