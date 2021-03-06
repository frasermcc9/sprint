import React, { forwardRef, PropsWithChildren } from "react";
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

const Page = forwardRef<HTMLElement, PropsWithChildren<PageProps>>(
  ({ children, className, animation = {} }, ref) => {
    return (
      <motion.main
        variants={animation}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: "easeOut", duration: 0.2 }}
        className="flex h-full w-full flex-col bg-gray-50"
        ref={ref}
      >
        <div
          className={classNames(
            "flex w-full max-w-6xl flex-grow flex-col self-center pb-20",
            className,
          )}
        >
          {children}
        </div>
      </motion.main>
    );
  },
);

const Margin: FCC = ({ children }) => {
  return <div className="mx-4 flex flex-grow flex-col">{children}</div>;
};

const Header: FCC = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center">{children}</div>
  );
};

const PageUpAnimation = {
  hidden: { opacity: 0, x: 0, y: 200 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 200 },
};

const Layout = {
  Page,
  Margin,
  Header,
  PageUpAnimation,
} as const;

export { Layout };
