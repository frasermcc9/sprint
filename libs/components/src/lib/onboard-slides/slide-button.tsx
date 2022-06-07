import React from "react";
import classNames from "classnames";

export interface SlideButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconStart?: boolean;
}

export const SlideButton: React.FC<SlideButtonProps> = ({
  text,
  onClick,
  className,
  icon,
  iconStart,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "font-palanquin flex items-center gap-x-2 rounded bg-indigo-600 px-4 py-1.5 text-xl font-medium text-white transition-colors hover:bg-indigo-500",
        { "flex-row-reverse": iconStart },
        className,
      )}
    >
      {text}
      {icon}
    </button>
  );
};

export default SlideButton;
