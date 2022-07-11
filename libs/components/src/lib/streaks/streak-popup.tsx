import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { FireOff, FireOn } from "@sprint/assets";
import { daysForLocale, modFloor } from "@sprint/common";
import classNames from "classnames";
import Image from "next/image";
import React, { Fragment, useMemo } from "react";
import Streaks from "./streak-icon";

export interface StreakPopupProps {
  streakSize: number;
  days: boolean[];
}

export const StreakPopover: React.FC<StreakPopupProps> = ({
  streakSize,
  days,
}) => {
  const today = new Date().getDay();

  const previousDays = useMemo(() => {
    const previousDays: number[] = [];
    previousDays[4] = today;
    for (let i = 0; i < 5; i++) {
      previousDays[5 - 1 - i] = modFloor(today - i - 1, 7);
    }
    return previousDays;
  }, [today]);

  const dayNames = useMemo(() => daysForLocale("en-US", "short"), []);

  const dayNamesForStreak = useMemo(
    () => previousDays.map((day) => dayNames[day]),
    [dayNames, previousDays],
  );

  return (
    <Popover className="static md:relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              { "text-opacity-90": open },
              "flex items-center",
            )}
          >
            <Streaks
              streakSize={streakSize}
              todayCompleted={days.at(-1) ?? false}
            />
            <ChevronDownIcon
              className={`${open ? "" : "text-opacity-70"}
            ml-2 h-5 w-5 text-gray-700 transition duration-150 ease-in-out group-hover:text-opacity-80`}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-1.5 z-50 mt-1.5 transform px-2 md:max-w-xs">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <div className="bg-white p-4">
                  <div className="flex justify-center gap-x-2">
                    {days.map((completed, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <Image
                          src={completed ? FireOn : FireOff}
                          width={36}
                          height={36}
                        />
                        <span className="font-palanquin text-lg font-bold">
                          {dayNamesForStreak[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 w-56 text-center text-sm leading-5 text-gray-400">
                    Make sure to do a run every two days to keep your streak
                    going!
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default StreakPopover;
