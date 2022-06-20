import React from "react";
import { FCC } from "@sprint/common";
import classNames from "classnames";
import { motion, Variants } from "framer-motion";

interface MotionParameters extends Variants {
  hidden: { opacity: number; x: number; y: number };
  enter: { opacity: number; x: number; y: number };
  exit: { opacity: number; x: number; y: number };
}

interface PageProps {
  className?: string;
  animation?: MotionParameters;
}

const Page: FCC<PageProps> = ({ children, className, animation = {} }) => {
  return (
    <motion.main
      variants={animation}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "easeOut", duration: 0.2 }}
      className="flex h-full w-full flex-col bg-gray-50"
    >
      <div
        className={classNames(
          "flex w-full max-w-6xl flex-grow flex-col self-center",
          className,
        )}
      >
        {children}
      </div>
    </motion.main>
  );
};

const Margin: FCC = ({ children }) => {
  return <div className="mx-4 flex flex-grow flex-col">{children}</div>;
};

const Header: FCC = ({ children }) => {
  return (
    <div className="mb-4 flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

const Layout = {
  Page,
  Margin,
  Header,
} as const;

export { Layout };
