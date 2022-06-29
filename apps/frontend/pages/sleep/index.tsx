import { ChevronUpIcon } from "@heroicons/react/solid";
import { Layout, useColorRangeRule } from "@sprint/components";
import classNames from "classnames";
import IconButton from "libs/components/src/lib/icon-button";
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

  const times = {
    awake: { value: "17%", color: "bg-red-400" },
    light: { value: "40%", color: "bg-pink-600" },
    rem: { value: "18%", color: "bg-indigo-400" },
    deep: { value: "25%", color: "bg-violet-700" },
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
            <h2 className="text-4xl font-normal ">{applyColor(40)}</h2>
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
                "h-20": detailsOpen,
                "h-0": !detailsOpen,
              },
            )}
          >
            <div className="my-2 flex h-6 w-full px-8">
              {Object.entries(times).map(([key, value]) => (
                <div
                  key={key}
                  className={classNames(
                    "flex flex-1 flex-col items-center justify-center",
                    value.color,
                  )}
                  style={{ width: value.value }}
                >
                  {value.value}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-x-4">
              <div className="flex items-center gap-x-1">
                <div className="h-4 w-4 rounded bg-red-400" />
                <span>Awake</span>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="h-4 w-4 rounded bg-pink-400" />
                <span>Light</span>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="h-4 w-4 rounded bg-indigo-400" />
                <span>REM</span>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="h-4 w-4 rounded bg-violet-400" />
                <span>Deep</span>
              </div>
            </div>
          </div>
        </div>
      </Layout.Header>
      <Layout.Margin></Layout.Margin>
    </Layout.Page>
  );
};

export default Index;
