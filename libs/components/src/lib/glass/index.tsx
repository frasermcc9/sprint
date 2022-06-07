import React from "react";
import cx from "classnames";

interface GlassProps {
  className?: string;
  children: React.ReactNode;
}

export const Glass: React.FC<GlassProps> = ({ className, children }) => {
  return <div className={cx(className, "card")}>{children}</div>;
};
