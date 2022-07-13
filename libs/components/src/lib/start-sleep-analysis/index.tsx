import { xpDetails } from "@sprint/common";
import { useCurrentUserQuery } from "@sprint/gql";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import NativeModal from "../native-modal";

export interface StartSleepAnalysisProps {
  useController: typeof useStartSleepAnalysisController;
}

export const StartSleepAnalysis: React.FC<StartSleepAnalysisProps> = ({
  useController,
}) => {
  const { goToAnalysis, canAccess } = useController();

  const [modal, setModal] = useState(false);

  return (
    <>
      <NativeModal
        title="Locked!"
        isOpen={modal}
        closeModal={() => setModal(false)}
        text="You must be level 5 before accessing the Sleep Analysis page."
      />
      <div className="font-palanquin relative mx-auto h-44 w-full max-w-xl select-none overflow-hidden rounded-lg p-2 shadow-lg">
        <img
          draggable={false}
          className={classNames(
            "back-ease absolute left-0 top-0 z-10 h-full w-full scale-110 transform cursor-pointer overflow-hidden object-cover brightness-75 transition-all hover:rotate-2 hover:scale-125",
            { "blur-sm brightness-50 saturate-0 filter": !canAccess },
          )}
          src={"https://images.unsplash.com/photo-1543286386-713bdd548da4"}
          onClick={goToAnalysis}
          alt=""
        />
        {!canAccess && (
          <div
            className="absolute top-0 left-0 z-30 flex h-full w-full flex-col items-center justify-center text-white"
            onClick={() => setModal(true)}
          >
            <LockClosedIcon className="h-24 w-24" />
            <span>Locked until level 5</span>
          </div>
        )}

        <div
          className={classNames(
            "pointer-events-none absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-br from-yellow-500 to-red-500 opacity-50",
            { "saturate-0": !canAccess },
          )}
        />
        <div
          className={classNames(
            "pointer-events-none absolute top-0 left-0 z-30 h-full w-full text-white",
            { "blur-sm": !canAccess },
          )}
        >
          <div className="flex h-full items-center justify-around p-1">
            <div className="text-shadow-md flex flex-col gap-y-2">
              <span className="text-xl font-bold">Sleep Analysis</span>
              <div className="w-60 text-sm font-normal">
                See the variables that improve or worsen your sleep.
              </div>
            </div>
            <div />
          </div>
        </div>
      </div>
    </>
  );
};

export const useStartSleepAnalysisController = () => {
  const { push } = useRouter();
  const { data } = useCurrentUserQuery();
  const { level } = xpDetails(data?.currentUser?.xp);

  const canAccess = level >= 5;

  const goToAnalysis = useCallback(() => push("/sleep/analysis"), [push]);

  return { goToAnalysis, canAccess };
};

export const useMockStartSleepAnalysisController: typeof useStartSleepAnalysisController =
  () => {
    return {
      goToAnalysis: () => Promise.resolve(true),
      canAccess: true,
    };
  };

export default StartSleepAnalysis;
