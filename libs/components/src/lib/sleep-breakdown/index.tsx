import { readableTime } from "@sprint/common";
import classNames from "classnames";
import React, { useCallback } from "react";

export type SleepTypeBreakdown = {
  value: string;
  color: string;
  name: string;
};

export type SleepTypes = "awake" | "light" | "deep" | "rem";

export interface SleepBreakdownProps {
  times: { [K in SleepTypes]: SleepTypeBreakdown };
  sleepDuration: number;
}

export const SleepBreakdown: React.FC<SleepBreakdownProps> = ({
  times,
  sleepDuration,
}) => {
  const formatDuration = useCallback(
    (duration: number) =>
      readableTime(duration * 60)
        .split(":")
        .slice(0, 2)
        .join(":")
        .replace(/^0+/, ""),
    [],
  );

  return (
    <div className="font-palanquin bg-indigo-900 text-gray-100">
      <div className="mt-2 mb-8 flex h-6 w-full px-8">
        {Object.entries(times).map(([key, { color, value }], index) => (
          <div key={key} className="flex flex-col" style={{ width: value }}>
            <div
              className={classNames("flex w-full justify-center border-r", {
                "border-l": index === 0,
              })}
            >
              <span className="text-sm">
                {formatDuration(
                  (+value.slice(0, value.length - 1) / 100) * sleepDuration,
                ) + " h"}
              </span>
            </div>
            <div
              key={key}
              className={classNames(
                "flex w-full flex-col items-center justify-center",
                color,
              )}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-x-4">
        {Object.entries(times).map(([key, { name, color }]) => (
          <div key={key} className="flex items-center gap-x-2">
            <div className={classNames("h-4 w-4 rounded", color)} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SleepBreakdown;
