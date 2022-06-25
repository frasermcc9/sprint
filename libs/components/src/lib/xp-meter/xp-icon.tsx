import { xpDetails } from "@sprint/common";
import classNames from "classnames";
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";

export interface XpIconProps {
  xp: number;
  size?: "sm" | "md" | "lg";
}

export const XpIcon: React.FC<XpIconProps> = ({ xp, size = "sm" }) => {
  const { level, xpThroughLevel, xpRequiredForLevel } = xpDetails(xp);
  const percentThroughLevel = (xpThroughLevel / xpRequiredForLevel) * 100;

  return (
    <div
      className={classNames("relative", {
        "h-8 w-8": size === "sm",
        "h-12 w-12": size === "md",
        "h-16 w-16": size === "lg",
      })}
    >
      <CircularProgressbar
        value={percentThroughLevel}
        styles={{
          path: {
            stroke: "rgb(79 70 229)",
          },
        }}
      />
      <div className="font-palanquin absolute top-0 left-0 flex h-full w-full items-center justify-center">
        <span
          className={classNames("pb-0.5 font-bold", {
            "text-lg": size === "md",
            "text-xl": size === "lg",
          })}
        >
          {level}
        </span>
      </div>
    </div>
  );
};

export default XpIcon;
