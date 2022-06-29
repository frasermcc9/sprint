import { ChevronUpIcon } from "@heroicons/react/solid";
import {
  Layout,
  SleepBreakdown,
  useColorRangeRule,
  IconButton,
} from "@sprint/components";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Index: React.FC = () => {
  const { back } = useRouter();

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

  const sleepDuration = 447;
  const sleepScore = 81;

  const times = {
    awake: { value: "17%", color: "bg-red-400", name: "Awake" },
    light: { value: "40%", color: "bg-pink-600", name: "Light" },
    rem: { value: "18%", color: "bg-indigo-400", name: "REM" },
    deep: { value: "25%", color: "bg-violet-700", name: "Deep" },
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
        <div className="flex w-full flex-col items-center justify-between bg-indigo-900 text-gray-100 transition-all">
          <div className="font-palanquin flex h-24 w-full flex-col items-center justify-center gap-y-2 ">
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
              "font-palanquin w-full overflow-hidden transition-all",
              {
                "h-24": detailsOpen,
                "h-0": !detailsOpen,
              },
            )}
          >
            <SleepBreakdown sleepDuration={sleepDuration} times={times} />
          </div>
        </div>
      </Layout.Header>
      <Layout.Margin></Layout.Margin>
    </Layout.Page>
  );
};

export default Index;
