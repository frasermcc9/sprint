import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { useEmoji } from "../hooks";

export interface StartSleepProps {
  useController: typeof useStartSleepController;
}

export const StartSleep: React.FC<StartSleepProps> = ({ useController }) => {
  const { goToSleep, todayCompleted } = useController();

  const SleepCompletedEmoji = useEmoji("🌕", "40");
  const SleepInCompleteEmoji = useEmoji("🌑", "40");

  return (
    <div className="font-palanquin relative mx-auto h-44 w-full max-w-xl select-none overflow-hidden rounded-lg p-2 shadow-lg">
      <img
        draggable={false}
        className="back-ease absolute left-0 top-0 z-10 h-full w-full scale-110 transform cursor-pointer overflow-hidden object-cover brightness-75 transition-all hover:rotate-2 hover:scale-125"
        src={
          "https://images.unsplash.com/photo-1572270947869-89e664b0792b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80"
        }
        onClick={goToSleep}
        alt=""
      />

      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-br from-indigo-500 to-emerald-500 opacity-75" />
      <div className="pointer-events-none absolute top-0 left-0 z-30 h-full w-full text-white ">
        <div className="flex h-full items-center justify-around p-1">
          <div className="text-shadow-md flex flex-col gap-y-2">
            <span className="text-xl font-bold">Last Nights Sleep</span>
            <div className="w-60 text-sm font-normal">
              Understand what impacts your sleep quality
            </div>
          </div>
          <div className="pointer-events-auto flex flex-col items-center">
            {todayCompleted ? (
              <SleepCompletedEmoji />
            ) : (
              <SleepInCompleteEmoji />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const useStartSleepController = () => {
  const { push } = useRouter();

  const goToSleep = useCallback(() => push("/sleep"), [push]);
  const todayCompleted = useMemo(() => false, []);

  return { goToSleep, todayCompleted };
};

export const useMockStartSleepController: typeof useStartSleepController =
  () => {
    return {
      goToSleep: () => Promise.resolve(true),
      todayCompleted: false,
    };
  };

export default StartSleep;
