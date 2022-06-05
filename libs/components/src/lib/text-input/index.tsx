import { useCallback } from "@storybook/addons";
import classNames from "classnames";
import React, { useState } from "react";

export interface TextInputProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value = "",
  className,
  onChange,
  id,
}) => {
  return (
    <input
      type="text"
      id={id}
      onChange={(e) => onChange?.(e.target.value)}
      value={value}
      className={classNames(
        "w-full rounded border py-2 px-3 text-gray-700 focus:outline-none focus:ring-2",
        className,
      )}
    />
  );
};

export default TextInput;
