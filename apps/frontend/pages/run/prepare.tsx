import {
  CircularProgress,
  Layout,
  useColorRule,
  useInterval,
} from "@sprint/components";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { usePrepareRunQuery } from "@sprint/gql";
import { toast } from "react-toastify";

export const Prepare: React.FC = () => {
  const { back } = useRouter();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const runDuration = parseInt(urlParams.get("duration") ?? "13", 10);

  const { data, loading, error } = usePrepareRunQuery({
    variables: {
      duration: runDuration,
    },
  });
  if (error) {
    console.log(error.message);
  }

  const sections = [
    `Your run will be ~ ${runDuration} minutes`,
    `Each high intensity section will be ${data?.prepRun?.highIntensity} seconds`,
    `Each low intensity section will be ${data?.prepRun?.lowIntensity} seconds`,
    `Number of reps will be ${data?.prepRun?.repetitions}`,
    `Each rest period will be ${data?.prepRun?.restPeriod} seconds`,
    `Number of sets will be ${data?.prepRun?.sets}`,
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
                    className={classNames("transition-opacity duration-500", {
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
