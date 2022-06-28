import { FCC } from "@sprint/common";
import classNames from "classnames";
import React, { ComponentProps } from "react";

interface IconButtonProps {
  Icon: React.ComponentType<ComponentProps<"svg">>;
  onClick?: () => void;
  className?: string;
  twSize?: string;
}

const IconButton: FCC<IconButtonProps> = ({
  Icon,
  children,
  onClick,
  className = "",
  twSize = "h-10 w-10",
}) => {
  return (
    <div
      className="relative cursor-pointer rounded bg-gray-800 bg-opacity-0 hover:bg-opacity-10"
      onClick={onClick}
    >
      <Icon className={classNames(twSize, "p-1", className)} />
      {children}
    </div>
  );
};

export default IconButton;
