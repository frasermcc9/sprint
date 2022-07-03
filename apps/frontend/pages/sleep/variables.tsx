import { Layout, useEmojiFactory } from "@sprint/components";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";

const defaultVariables = [
  {
    name: "Alcohol",
    emoji: "🍺",
  },
  {
    name: "Caffeine",
    emoji: "☕",
  },
  {
    name: "Shared Bed",
    emoji: "🛌",
  },
  {
    name: "Sick",
    emoji: "🤒",
  },
  {
    name: "Pet in Bedroom",
    emoji: "🐶",
  },
  {
    name: "Read In Bed",
    emoji: "📖",
  },
  {
    name: "Phone in Bed",
    emoji: "📱",
  },
];

const Index: React.FC = () => {
  const { back } = useRouter();
  const makeEmoji = useEmojiFactory();

  const [variables, setVariables] = useState<string[]>([]);

  return (
    <Layout.Page animation={Layout.PageUpAnimation}>
      <Layout.Header>
        <div className="font-palanquin flex w-full items-center border-b-2 border-gray-300 py-2 text-gray-700">
          <div className="invisible mx-8 w-32" />
          <div className="w-full text-center text-xl font-bold">
            Add Variables
          </div>
          <span
            className="mx-8 w-32 cursor-pointer text-xl font-bold text-indigo-600"
            onClick={back}
          >
            Done
          </span>
        </div>
      </Layout.Header>

      <div className="font-palanquin flex flex-col divide-y-2 divide-gray-300 text-xl font-light">
        {defaultVariables.map(({ name, emoji }) => (
          <div
            key={name}
            className={classNames(
              "flex items-center justify-between px-4 transition-colors duration-100",
              {
                "bg-indigo-100": variables.includes(name),
              },
            )}
            onClick={() => {
              if (variables.includes(name)) {
                return setVariables(variables.filter((v) => v !== name));
              }
              setVariables([...variables, name]);
            }}
          >
            <div className="flex items-center gap-x-3 py-3">
              <div>{makeEmoji(emoji, "24px")}</div>
              <div>{name}</div>
            </div>
            <input
              type="checkbox"
              readOnly
              className="pointer-events-none h-4 w-4"
              checked={variables.includes(name)}
            />
          </div>
        ))}
        <div></div>
      </div>
    </Layout.Page>
  );
};

export default Index;
