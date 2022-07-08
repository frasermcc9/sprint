import classNames from "classnames";
import React from "react";
import { useEmojiFactory } from "../hooks";

export interface SleepVariableProps {
  name: string;
  onClick?: () => void;
  emoji: string;
  active: boolean;
  readonly?: boolean;
  rounded?: boolean;
}

export const SleepVariable: React.FC<SleepVariableProps> = ({
  emoji,
  name,
  onClick,
  active,
  readonly,
  rounded,
}) => {
  const makeEmoji = useEmojiFactory();

  return (
    <div
      className={classNames(
        "flex items-center justify-between px-4 transition-colors duration-100",
        {
          "bg-indigo-100": active,
          "cursor-pointer": !readonly,
          "rounded-lg": rounded,
        },
      )}
      onClick={!readonly ? onClick : () => null}
    >
      <div className="font-palanquin flex items-center gap-x-3 py-3 text-xl">
        <div>{makeEmoji(emoji, "24px")}</div>
        <div>{name}</div>
      </div>
      {!readonly && (
        <input
          type="checkbox"
          readOnly
          className="pointer-events-none h-4 w-4"
          checked={active}
        />
      )}
    </div>
  );
};

export default SleepVariable;
