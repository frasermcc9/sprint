import { CircularProgress, Layout, useColorRule } from "@sprint/components";
import classNames from "classnames";
import { useInterval } from "libs/components/src/lib/hooks/useInterval";
import { useRouter } from "next/router";
import React, { useState } from "react";

export const Prepare: React.FC = () => {
  const { back } = useRouter();

  const sections = [
    "Your run will be 15 minutes",
    "Each high intensity section will be 3 minutes",
    "Each low intensity section will be 5 minutes",
  ];

  const duration = 6;
  const sectionCount = sections.length;

  const [visibleSections, setSectionVisibility] = useState(0);

  const colorize = useColorRule([
    { test: /[1-9]+/, className: "text-indigo-600 font-semibold" },
  ]);

  useInterval({
    update: () => setSectionVisibility((p) => p + 1),
    isComplete: () => visibleSections >= sectionCount,
    rate: (duration / (sectionCount + 1)) * 1000,
  });

  return (
    <Layout.Page
      animation={{
        hidden: { opacity: 0, x: 0, y: 200 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 0, y: 200 },
      }}
    >
      <Layout.Margin>
        <section className="font-palanquin flex h-full flex-grow flex-col">
          <section className="mx-4 mt-8 flex flex-grow flex-col">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Preparing Run...</h1>
              <div className="w-12">
                <CircularProgress duration={5} mode="auto" />
              </div>
            </div>
            <div className="ml-4 mt-8 flex flex-col gap-y-6">
              {sections.map((section, index) => {
                const isVisible = index < visibleSections + 1;
                return (
                  <ul
                    key={index}
                    className={classNames("transition-opacity", {
                      "opacity-0": !isVisible,
                      "opacity-100": isVisible,
                    })}
                  >
                    <div className="flex items-center gap-x-4">
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      <span className="leading-tight">{colorize(section)}</span>
                    </div>
                  </ul>
                );
              })}
            </div>
          </section>
          <section className="mb-8 flex justify-center">
            <button
              className="rounded-full bg-gray-300 px-8 py-2 text-lg font-semibold text-gray-900"
              onClick={back}
            >
              Undo
            </button>
          </section>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default Prepare;
