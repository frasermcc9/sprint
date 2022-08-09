import { Run } from "@sprint/gql";
import React from "react";
import NumberInCircle from "../number-in-circle";
import Link from "next/link";

export interface RunCardProps {
  rundate: string;
  duration: number;
  feedback: number;
  runObj: Run;
}

export const RunCard: React.FC<RunCardProps> = ({
  rundate,
  duration,
  feedback,
  runObj,
}) => {
  const FilteredRunObj = {
    userId: runObj.userId,
    date: runObj.date,
    duration: runObj.duration,
    heartRate: runObj.heartRate,
    vo2max: runObj.vo2max,
    intensityFeedback: runObj.intensityFeedback,
  };
  return (
    <div className="mb-2 rounded-md border-2 border-gray-500 p-2 shadow-md">
      <div className="flex flex-row items-center gap-x-2">
        <div className="mr-2">
          <NumberInCircle number={feedback} />
        </div>

        <div className="font-palanquin flex flex-col text-gray-600">
          <div className="font-bold">{rundate}</div>
          <div className="text-sm font-semibold">Duration: {duration}mins</div>
        </div>
        <Link
          href={{
            pathname: "/run/analysis",
            query: { object: JSON.stringify(FilteredRunObj) },
          }}
        >
          <button className="ml-auto rounded-md bg-indigo-600 p-2 text-gray-50 ">
            Analyse Run
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RunCard;
