import { CurrentUserDocument, CurrentUserQuery, Run } from "@sprint/gql";
import React, { useState } from "react";
import NumberInCircle from "../number-in-circle";
import Link from "next/link";
import { useResyncRunMutation } from "@sprint/gql";

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
    userId: runObj?.userId,
    date: runObj?.date,
    duration: runObj?.duration,
    heartRate: runObj?.heartRate,
    vo2max: runObj?.vo2max,
    intensityFeedback: runObj?.intensityFeedback,
  };
  const [execResyncRun] = useResyncRunMutation();

  const resyncRun = () => {
    console.log("resyncRun");
    execResyncRun({
      variables: {
        startDate: rundate.split("T")[0],
        startTime: rundate.split("T")[1],
        duration,
        intensityFeedback: feedback,
      },
      optimisticResponse: {
        __typename: "Mutation",
        resyncRun: {
          __typename: "Run",
          userId: "",
          date: rundate.split("T")[0],
          duration: 0,
          heartRate: [],
          vo2max: 0,
          intensityFeedback: feedback,
        },
      },
      update: (cache, { data: result }) => {
        const data = cache.readQuery<CurrentUserQuery>({
          query: CurrentUserDocument,
        });
        if (data) {
          cache.writeQuery({
            query: CurrentUserDocument,
            data: {
              ...data,
              currentUser: {
                ...data.currentUser,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                runs: [...data.currentUser!.runs],
              },
            },
          });
        }
      },
    });
  };

  return (
    <div className="mb-2 rounded-md border-2 border-gray-500 p-2 shadow-md">
      <div className="flex flex-row items-center gap-x-2">
        <div className="mr-2">
          <NumberInCircle number={feedback} />
        </div>

        <div className="font-palanquin flex flex-col text-gray-600">
          <div className="font-bold">{rundate.split("T")[0]}</div>
          <div className="text-sm font-semibold">Duration: {duration}mins</div>
        </div>

        {FilteredRunObj?.heartRate?.length !== duration + 1 ? (
          <button
            className="ml-auto rounded-md bg-gray-600 p-2 text-gray-50 "
            onClick={resyncRun}
          >
            Resync Run
          </button>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default RunCard;
