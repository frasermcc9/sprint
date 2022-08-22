import { CurrentUserDocument, CurrentUserQuery, Run } from "@sprint/gql";
import React, { useMemo } from "react";
import NumberInCircle from "../number-in-circle";
import Link from "next/link";
import { useResyncRunMutation } from "@sprint/gql";
import { toast } from "react-toastify";

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
    const res = execResyncRun({
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

        if (!data) return;

        if (!data.currentUser) return;

        if (!result?.resyncRun) return;

        const newRuns = [
          // ...data.currentUser.runs.slice(0, -1),
          // result.resyncRun,
          ...data.currentUser.runs,
        ];
        newRuns.forEach((item, i, self) => {
          if (!result.resyncRun) return;
          if (item.date === rundate) {
            self[i] = result.resyncRun;
          }
        });

        if (data) {
          cache.writeQuery({
            query: CurrentUserDocument,
            data: {
              ...data,
              currentUser: {
                ...data.currentUser,
                runs: newRuns,
              },
            },
          });
        }
      },
    });
    toast.promise(res, {
      error: "Failed to record run.",
      pending: "Resyncing Run",
      success: "Run resynced",
    });
  };

  const isRunValid = useMemo<boolean>(() => {
    return FilteredRunObj?.heartRate?.length !== duration + 1;
  }, [FilteredRunObj?.heartRate, duration]);

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

        {isRunValid ? (
          <button
            className="ml-auto min-w-[105px] rounded-md bg-gray-600 p-2 text-gray-50 "
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
            <button className="ml-auto min-w-[105px] rounded-md bg-indigo-600 p-2 text-gray-50 ">
              Analyse Run
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default RunCard;
