import React from "react";

export interface RunCardProps {
  rundate: string;
  duration: string;
}

export const RunCard: React.FC<RunCardProps> = ({ rundate, duration }) => {
  return (
    <div className="relative h-16 rounded-xl">
      <div className="absolute top-0 left-0 flex flex-row items-center gap-x-2">
        <div className="font-palanquin flex flex-col text-gray-600">
          <div className="font-bold">{rundate}</div>
          <div className="text-sm font-semibold">Duration: {duration}mins</div>
        </div>
      </div>
    </div>
  );
};

export default RunCard;
