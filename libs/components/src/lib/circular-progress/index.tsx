import React, { useState, useTransition } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useInterval } from "../hooks/useInterval";

export interface CircularProgressProps<T extends "auto" | "manual"> {
  value?: T extends "auto" ? never : number;
  mode?: T;
  duration?: T extends "auto" ? number : never;
}

export const CircularProgress: React.FC<
  CircularProgressProps<"auto" | "manual">
> = ({ value = 0, mode = "auto", duration = 1 }) => {
  const [autoProgress, setAutoProgress] = useState(0);
  const [, startTransition] = useTransition();

  const display = mode === "auto" ? autoProgress : value;

  useInterval({
    update: () =>
      startTransition(() => setAutoProgress((old) => old + 10 / duration)),
    isComplete: () => autoProgress >= 100,
    rate: 100,
    condition: mode === "auto",
  });

  return (
    <CircularProgressbar
      value={display}
      maxValue={100}
      styles={{
        path: {
          transitionTimingFunction: "linear",
          stroke: "rgb(79 70 229)",
        },
      }}
    />
  );
};

export default CircularProgress;
