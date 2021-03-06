import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";
import { readableTimeNoSeconds, Sleep } from "@sprint/common";
import {
  IconButton,
  Layout,
  SleepBreakdown,
  SleepVariable,
  useColorRangeRule,
  useLog,
} from "@sprint/components";
import {
  MostRecentSleepDocument,
  MostRecentSleepQuery,
  SleepVariable as TSleepVar,
  useAddSleepVariableMutation,
  useCustomSleepVariablesQuery,
  useMostRecentSleepQuery,
  useRemoveSleepVariableMutation,
} from "@sprint/gql";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

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

  const { data: sleepVariables } = useCustomSleepVariablesQuery();
  const { data, loading, fetchMore } = useMostRecentSleepQuery({
    notifyOnNetworkStatusChange: true,
  });
  const [cursor, setCursor] = useState<number>(
    (data?.currentUser?.todaysSleep.length ?? 1) - 1,
  );

  useLog(
    "SleepPage",
    `Showing sleep data for ${
      data?.currentUser?.todaysSleep?.at(cursor)?.date
    }`,
  );

  const sleepArray = useMemo(
    () => data?.currentUser?.todaysSleep ?? [],
    [data?.currentUser?.todaysSleep],
  );

  const todaysSleep = useMemo(
    () =>
      sleepArray?.at(cursor) ?? {
        awake: 0,
        awakenings: 0,
        date: "",
        deep: 0,
        light: 0,
        rem: 0,
        sleep: 0,
        ownerId: "",
        score: 0,
        tomorrow: "",
        yesterday: "",
        variables: [] as TSleepVar[],
      },
    [cursor, sleepArray],
  );

  const sleepDuration =
    todaysSleep?.deep + todaysSleep?.light + todaysSleep?.rem ?? 0;
  const sleepScore = todaysSleep?.score ?? 0;
  const timeInBed = sleepDuration + todaysSleep?.awake ?? 0;

  const calcPercent = useCallback(
    (t?: number) => Math.round(((t ?? 0) / timeInBed) * 100) + "%",
    [timeInBed],
  );

  const times = useMemo(
    () => ({
      awake: {
        value: calcPercent(todaysSleep?.awake),
        color: "bg-red-400",
        name: "Awake",
        duration: todaysSleep?.awake,
      },
      light: {
        value: calcPercent(todaysSleep?.light),
        color: "bg-pink-600",
        name: "Light",
        duration: todaysSleep?.light,
      },
      rem: {
        value: calcPercent(todaysSleep?.rem),
        color: "bg-indigo-400",
        name: "REM",
        duration: todaysSleep?.rem,
      },
      deep: {
        value: calcPercent(todaysSleep?.deep),
        color: "bg-violet-700",
        name: "Deep",
        duration: todaysSleep?.deep,
      },
    }),
    [calcPercent, todaysSleep],
  );

  const yesterday = todaysSleep?.yesterday;
  const tomorrow = todaysSleep?.tomorrow;

  const [addVariableMut] = useAddSleepVariableMutation();
  const [removeVariableMut] = useRemoveSleepVariableMutation();

  const removeVariable = useCallback(
    (name: string) => {
      removeVariableMut({
        variables: { name, sleepDate: todaysSleep.date },
        optimisticResponse: ({ name }) => ({
          removeSleepVariable: {
            date: todaysSleep.date,
            variables: [
              ...(todaysSleep?.variables?.filter((v) => v?.name !== name) ??
                []),
            ],
          },
        }),
        update: (cache, { data: newData }) => {
          const oldData = cache.readQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
          });

          if (!oldData || !newData || !oldData.currentUser || !todaysSleep) {
            return;
          }

          cache.writeQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
            data: {
              currentUser: {
                ...oldData.currentUser,
                todaysSleep: [
                  {
                    ...todaysSleep,
                    variables: newData.removeSleepVariable?.variables,
                  },
                ],
              },
            },
          });
        },
      });
    },
    [removeVariableMut, todaysSleep],
  );

  const addVariable = useCallback(
    (name: string, emoji: string, custom: boolean) => {
      addVariableMut({
        variables: { name, emoji, custom, sleepDate: todaysSleep.date },
        optimisticResponse: ({ sleepDate, ...rest }) => ({
          addSleepVariable: {
            date: todaysSleep.date,
            variables: [...(todaysSleep?.variables ?? []), rest],
          },
        }),
        update: (cache, { data: newData }) => {
          const oldData = cache.readQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
          });

          if (!oldData || !newData || !oldData.currentUser || !todaysSleep) {
            return;
          }

          cache.writeQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
            data: {
              currentUser: {
                ...oldData.currentUser,
                todaysSleep: [
                  {
                    ...todaysSleep,
                    variables: newData.addSleepVariable?.variables,
                  },
                ],
              },
            },
          });
        },
      });
    },
    [addVariableMut, todaysSleep],
  );

  const joinedVariables = useMemo(
    () =>
      [
        ...Sleep.defaultVariables,
        ...(sleepVariables?.currentUser?.sleepVariables ?? []),
      ].filter((v) =>
        sleepVariables?.currentUser?.trackedVariables?.includes(v?.name ?? ""),
      ),
    [sleepVariables],
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
          <div className="w-full text-center text-xl font-bold">Sleep</div>
          <span
            className="mx-8 w-32 cursor-pointer text-xl font-bold text-indigo-200 "
            onClick={() => back()}
          >
            {"Done"}
          </span>
        </div>
        <div className="relative flex w-full flex-col items-center justify-between bg-indigo-900 text-gray-100 transition-all">
          <div className="absolute left-8 top-2 h-12 w-12 rounded-full bg-indigo-800" />
          <div className="absolute top-20 right-4 h-8 w-8 rounded-full bg-indigo-800" />
          <div className="font-palanquin z-10 flex h-24 w-full flex-col items-center justify-center gap-y-2">
            <div className="flex w-full items-center justify-center gap-x-8">
              <IconButton
                Icon={ChevronLeftIcon}
                twSize="w-12 h-12"
                className={classNames({ "invisible select-none": !yesterday })}
                onClick={async () => {
                  if (!yesterday || loading) return;
                  if (cursor > 0) {
                    return setCursor((c) => c - 1);
                  }
                  await fetchMore({
                    variables: { sourceUrl: yesterday },
                  });
                }}
              />
              <h2 className="text-4xl font-normal ">
                {applyColor(sleepScore)}
              </h2>
              <IconButton
                Icon={ChevronRightIcon}
                twSize="w-12 h-12"
                className={classNames({ "invisible select-none": !tomorrow })}
                onClick={async () => {
                  if (!tomorrow || loading) return;
                  setCursor((c) => c + 1);
                }}
              />
            </div>
            <h1 className="font-bold">{todaysSleep.date}</h1>
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
        <div className="flex flex-col gap-y-2">
          {joinedVariables?.map((variable) => {
            if (!variable) return null;

            const { custom, name, emoji } = variable;
            const enabled = !!todaysSleep.variables?.some(
              (v) => v?.name === name,
            );
            return (
              <SleepVariable
                key={name}
                active={enabled}
                emoji={
                  custom
                    ? emoji ?? ""
                    : Sleep.defaultVariables.find((v) => v.name === name)
                        ?.emoji ?? ""
                }
                name={name}
                rounded
                onClick={() => {
                  if (enabled) {
                    return removeVariable(name);
                  }
                  return addVariable(name, emoji ?? "", custom);
                }}
              />
            );
          })}
        </div>
        <button
          className="font-palanquin text-light mt-2 w-full rounded-lg border border-dashed border-gray-400 py-4 text-center transition-colors hover:bg-gray-200"
          onClick={() => push("/sleep/variables?date=" + todaysSleep.date)}
        >
          {!sleepVariables?.currentUser?.trackedVariables.length
            ? "No variables. Tap here to track some!"
            : "Track additional variables"}
        </button>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default Index;
