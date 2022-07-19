import classNames from "classnames";
import React from "react";

export interface TextInputProps {
  className?: string;
  value?: string;
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  min?: string;
  max?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value = "",
  className,
  onChange,
  id,
  type = "text",
  placeholder = "",
  min = 0,
  max = 100,
}) => {
  return (
    <input
      type={type}
      id={id}
      onChange={onChange}
      value={value}
      className={classNames(
        "w-full rounded border  py-2 px-3 text-gray-700 focus:outline-none focus:ring-2",
        className,
      )}
      placeholder={placeholder}
      min={min}
      max={max}
    />
  );
};

export default TextInput;
