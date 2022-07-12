import { Sleep } from "@sprint/common";
import { Layout, useEmoji, useEmojiFactory } from "@sprint/components";
import {
  useAnalyzeSleepQuery,
  useCustomSleepVariablesQuery,
} from "@sprint/gql";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";

export const SleepAnalysisPage: React.FC = () => {
  const { back } = useRouter();

  const SleepEmoji = useEmoji("💤", "64px");
  const createEmoji = useEmojiFactory();

  const { data: sleepData, loading: sleepLoading } = useAnalyzeSleepQuery({
    fetchPolicy: "cache-and-network",
  });
  const { data: variablesData, loading: variablesLoading } =
    useCustomSleepVariablesQuery({
      fetchPolicy: "cache-and-network",
    });

  const { components, regressionIntercept } = sleepData?.analyzeSleep ?? {};

  const sortedComponents = components
    ?.slice()
    .sort((a, b) => b.regressionGradient - a.regressionGradient);

  const loading = sleepLoading || variablesLoading;

  const joinedVariables = useMemo(
    () =>
      [
        ...Sleep.defaultVariables,
        ...(variablesData?.currentUser?.sleepVariables ?? []),
      ].filter((v) =>
        variablesData?.currentUser?.trackedVariables?.includes(v?.name ?? ""),
      ),
    [variablesData],
  );

  const percentIncrease = useCallback(
    (gradient: number) => (gradient / (regressionIntercept ?? 1)) * 100,
    [regressionIntercept],
  );

  const variableAnalysis = useMemo(
    () =>
      components?.map((c) => ({
        ...c,
        percentIncrease: percentIncrease(c.regressionGradient),
      })),
    [components, percentIncrease],
  );

  const maximum = useMemo(
    () =>
      variableAnalysis?.reduce(
        (max, c) => Math.max(max, Math.abs(c.regressionGradient)),
        0,
      ) ?? 1,
    [variableAnalysis],
  );

  const percentOfMax = useCallback(
    (value: number) => (Math.abs(value) / maximum) * 100,
    [maximum],
  );

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
        <>
          {loading && (
            <div className="mt-8 flex w-full animate-pulse flex-col items-center gap-y-2">
              <SleepEmoji />
              <span className="font-palanquin text-lg font-light text-gray-700">
                Analyzing Sleep...
              </span>
            </div>
          )}
          {!loading && sortedComponents && (
            <div className="mt-4 flex w-full flex-col gap-y-4">
              <div className="font-palanquin mb-4">
                <div className="mx-auto max-w-xs text-center font-light text-gray-800">
                  This shows how your sleep quality is affected by your tracked
                  variables.
                </div>
                <div className="relative mt-6 flex w-full">
                  <div className="w-full bg-gray-900 py-px" />
                  <div className="absolute left-1/2 -top-2 h-4 bg-gray-900 px-px" />
                  <div className="absolute top-2 w-full text-center font-bold">
                    {Math.round(regressionIntercept ?? 0)}
                  </div>
                </div>
              </div>
              {sortedComponents.map(({ regressionGradient, variable }) => {
                const { emoji } =
                  joinedVariables.find((j) => j?.name === variable) ?? {};
                const isNegative = regressionGradient < 0;

                return (
                  <div key={variable} className="flex w-full flex-col gap-y-2">
                    <div className="font-palanquin flex items-center justify-between text-2xl">
                      <div className="flex items-center gap-x-4">
                        <div>{createEmoji(emoji, "40px")}</div>
                        <div className="text-xl font-medium">{variable}</div>
                      </div>
                      <div
                        className={classNames("font-bold", {
                          "text-red-400": isNegative,
                          "text-green-400": !isNegative,
                        })}
                      >
                        {Math.round(percentIncrease(regressionGradient))}%
                      </div>
                    </div>
                    <div className="flex w-full rounded-full bg-gray-300">
                      <div
                        className={classNames("rounded-full bg-red-400 py-1", {
                          invisible: !isNegative,
                          "ml-auto": isNegative,
                        })}
                        style={{
                          width: isNegative
                            ? percentOfMax(regressionGradient) / 2 + "%"
                            : "50%",
                        }}
                      />
                      <div
                        className={classNames(
                          "rounded-full bg-green-400 py-1",
                          { invisible: isNegative, "mr-auto": !isNegative },
                        )}
                        style={{
                          width: isNegative
                            ? "50%"
                            : percentOfMax(regressionGradient) / 2 + "%",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default SleepAnalysisPage;
