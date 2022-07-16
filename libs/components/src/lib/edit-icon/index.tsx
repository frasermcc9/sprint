import { PencilIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import React from "react";

export interface EditIconProps {
  onClick?: () => void;
  Icon?: React.ComponentType;
  positionClassName?: string;
}

export const EditIcon: React.FC<EditIconProps> = ({
  onClick,
  Icon = PencilIcon,
  positionClassName = "top-0 right-0",
}) => (
  <div
    className={classNames(
      "absolute rounded-full bg-indigo-600",
      positionClassName,
    )}
  >
    <Icon className="h-6 w-6 p-0.5 text-white" onClick={onClick} />
  </div>
);

export default EditIcon;
