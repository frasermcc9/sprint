import { Layout, useEmoji } from "@sprint/components";
import { useAnalyzeSleepQuery } from "@sprint/gql";
import { useRouter } from "next/router";
import React from "react";

export const SleepAnalysisPage: React.FC = () => {
  const { back } = useRouter();

  const SleepEmoji = useEmoji("💤", "64px");

  const { data, loading } = useAnalyzeSleepQuery();

  const { components, regressionIntercept } = data?.analyzeSleep ?? {};

  const sortedComponents = components
    ?.slice()
    .sort((a, b) => b.regressionGradient - a.regressionGradient);

  console.log({ sortedComponents, regressionIntercept });

  return (
    <Layout.Page
      animation={{
        hidden: { opacity: 0, x: 0, y: 200 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 0, y: 200 },
      }}
    >
      <Layout.Header>
        <div className="font-palanquin flex w-full items-center bg-indigo-900 py-2 text-gray-100">
          <div className="invisible mx-8 w-32" />
          <div className="w-full text-center text-xl font-bold">
            Sleep Analysis
          </div>
          <span
            className="mx-8 w-32 cursor-pointer text-xl font-bold text-indigo-200 "
            onClick={() => back()}
          >
            {"Done"}
          </span>
        </div>
      </Layout.Header>
      <Layout.Margin>
        {!loading && (
          <div className="mt-8 flex w-full animate-pulse flex-col items-center gap-y-2">
            <SleepEmoji />
            <span className="font-palanquin text-lg font-light text-gray-700">
              Analyzing Sleep...
            </span>
          </div>
        )}
      </Layout.Margin>
    </Layout.Page>
  );
};

export default SleepAnalysisPage;
