import { ChevronUpIcon } from "@heroicons/react/solid";
import { readableTimeNoSeconds } from "@sprint/common";
import {
  IconButton,
  Layout,
  SleepBreakdown,
  useColorRangeRule,
} from "@sprint/components";
import { useGetTodaysSleepQuery } from "@sprint/gql";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Index: React.FC = () => {
  const { back, push } = useRouter();

  const applyColor = useColorRangeRule([
    {
      className:
        "bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-purple-500 to-indigo-400",
      range: [95, 100],
    },
    { className: "text-emerald-500", range: [80, 94] },
    { className: "text-amber-400", range: [51, 79] },
    { className: "text-red-500", range: [0, 50] },
  ]);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, loading } = useGetTodaysSleepQuery();

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  const {
    currentUser: { todaysSleep },
  } = data;

  const sleepDuration = todaysSleep.deep + todaysSleep.light + todaysSleep.rem;
  const sleepScore = todaysSleep.score;

  const timeInBed = sleepDuration + todaysSleep.awake;

  const calcPercent = (t) => Math.round((t / timeInBed) * 100) + "%";

  const times = {
    awake: {
      value: calcPercent(todaysSleep.awake),
      color: "bg-red-400",
      name: "Awake",
      duration: todaysSleep.awake,
    },
    light: {
      value: calcPercent(todaysSleep.light),
      color: "bg-pink-600",
      name: "Light",
      duration: todaysSleep.light,
    },
    rem: {
      value: calcPercent(todaysSleep.rem),
      color: "bg-indigo-400",
      name: "REM",
      duration: todaysSleep.rem,
    },
    deep: {
      value: calcPercent(todaysSleep.deep),
      color: "bg-violet-700",
      name: "Deep",
      duration: todaysSleep.deep,
    },
  };

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
          <div className="w-full text-center text-xl font-bold">Sleep</div>
          <span
            className="mx-8 w-32 cursor-pointer text-xl font-bold text-indigo-200"
            onClick={() => back()}
          >
            {"Done"}
          </span>
        </div>
        <div className="relative flex w-full flex-col items-center justify-between bg-indigo-900 text-gray-100 transition-all">
          <div className="absolute left-8 top-0 h-12 w-12 rounded-full bg-indigo-800" />
          <div className="absolute top-20 right-4 h-8 w-8 rounded-full bg-indigo-800" />
          <div className="font-palanquin z-10 flex h-24 w-full flex-col items-center justify-center gap-y-2">
            <h2 className="text-4xl font-normal ">{applyColor(sleepScore)}</h2>
            <h1 className="font-bold">Last Nights Rating</h1>
          </div>
          <IconButton
            Icon={ChevronUpIcon}
            onClick={() => setDetailsOpen((prev) => !prev)}
            className={classNames("transition-all duration-100", {
              "rotate-180": detailsOpen,
            })}
          />
          <div
            className={classNames(
              "font-palanquin z-10 w-full overflow-hidden transition-all",
              {
                "h-32": detailsOpen,
                "h-0": !detailsOpen,
              },
            )}
          >
            <h2 className="text-center">
              You slept for {readableTimeNoSeconds(sleepDuration)}h
            </h2>
            <SleepBreakdown sleepDuration={sleepDuration} times={times} />
          </div>
        </div>
      </Layout.Header>
      <Layout.Margin>
        <h1 className="font-palanquin my-2 text-2xl font-semibold">
          Variables
        </h1>
        <button
          className="font-palanquin text-light w-full rounded-lg border border-dashed border-gray-400 py-4 text-center transition-colors hover:bg-gray-200"
          onClick={() => push("/sleep/variables")}
        >
          No variables. Tap here to add some!
        </button>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default Index;
