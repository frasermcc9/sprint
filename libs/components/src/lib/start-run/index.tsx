import React, { useCallback, useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import {
  useCurrentUserQuery,
  useUpdateDefaultRunDurationMutation,
} from "@sprint/gql";
import { NativeModal } from "@sprint/components";
import { useRouter } from "next/router";

export interface StartRunProps {
  useController: typeof useStartRunController;
}

export const StartRun: React.FC<StartRunProps> = ({ useController }) => {
  const { runDuration, setRunDuration, startRun } = useController();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="font-palanquin relative mx-auto h-44 w-full max-w-xl select-none overflow-hidden rounded-lg p-2 shadow-lg">
        <img
          draggable={false}
          className="back-ease absolute left-0 top-0 z-10 h-full w-full scale-110 transform cursor-pointer object-cover brightness-75 transition-all hover:rotate-2 hover:scale-125"
          src={
            "https://www.si.com/.image/t_share/MTg5NDMzOTYwNzAxMzcyMDAx/best-running-shoes_lead.png"
          }
          onClick={() => setIsOpen(true)}
          alt=""
        />

        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-br from-indigo-500 to-red-500 opacity-75" />
        <div className="pointer-events-none absolute top-0 left-0 z-30 h-full w-full text-white ">
          <div className="flex h-full items-center justify-around p-1">
            <div className="text-shadow-md flex flex-col gap-y-2">
              <span className="text-xl font-bold">Quick Run</span>
              <div className="text-sm font-normal">
                Quickly start a new running session
              </div>
            </div>
            <div className="pointer-events-auto flex flex-col items-center">
              <ChevronUpIcon
                className="h-10 w-10 cursor-pointer rounded-lg p-1 hover:bg-gray-50 hover:bg-opacity-20"
                onClick={() => setRunDuration((e) => Math.min(e + 3, 28))}
              />
              <span className="text-2xl font-bold">{runDuration}</span>
              <span className="text-md font-normal">Minutes</span>
              <ChevronDownIcon
                className="h-10 w-10 cursor-pointer rounded-lg p-1 hover:bg-gray-50 hover:bg-opacity-20"
                onClick={() => setRunDuration((e) => Math.max(e - 3, 10))}
              />
            </div>
          </div>
        </div>
      </div>
      <NativeModal
        action={startRun}
        actionText="Let's Go!"
        title="Confirmation"
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
        text={`Are you sure you want to start a ${runDuration} minute session?`}
      />
    </>
  );
};

export const useStartRunController = () => {
  const { data, loading } = useCurrentUserQuery();
  const [updateRunDuration] = useUpdateDefaultRunDurationMutation();
  const { push } = useRouter();

  const [runDuration, setRunDuration] = useState(13);

  const startRun = useCallback(() => {
    push("/run/prepare?duration=" + runDuration);
  }, [push]);

  useEffect(() => {
    if (!loading && data) {
      setRunDuration(data.currentUser?.defaultRunDuration ?? 13);
    }
  }, [data, loading]);

  const setRunDurationWrapper = useCallback(
    (updater: (previous: number) => number) => {
      const duration = updater(runDuration);
      updateRunDuration({ variables: { duration } });
      setRunDuration(updater);
    },
    [],
  );

  return { runDuration, setRunDuration: setRunDurationWrapper, startRun };
};

export const useMockStartRunController: typeof useStartRunController = () => {
  return {
    runDuration: 13,
    setRunDuration: () => null,
    startRun: () => null,
  };
};

export default StartRun;
