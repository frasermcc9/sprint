import { PlusCircleIcon } from "@heroicons/react/outline";
import { Sleep } from "@sprint/common";
import {
  Layout,
  SleepVariable,
  TextInput,
  useEmojiFactory,
} from "@sprint/components";
import {
  MostRecentSleepDocument,
  MostRecentSleepQuery,
  useAddSleepVariableMutation,
  useCustomSleepVariablesQuery,
  useMostRecentSleepQuery,
  useRemoveSleepVariableMutation,
  useCreateSleepVariableMutation,
} from "@sprint/gql";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const Index: React.FC = () => {
  const { back, query } = useRouter();
  const date = query.date as string;

  const { data: sleepData } = useMostRecentSleepQuery();
  const { data: sleepVariables } = useCustomSleepVariablesQuery();

  const [addVariableMut] = useAddSleepVariableMutation();
  const [removeVariableMut] = useRemoveSleepVariableMutation();
  const [createSleepVariableMut] = useCreateSleepVariableMutation();

  const sleepForDate = useMemo(
    () => sleepData?.currentUser?.todaysSleep.find((s) => s?.date === date),
    [date, sleepData?.currentUser?.todaysSleep],
  );

  const removeVariable = useCallback(
    (name: string) => {
      removeVariableMut({
        variables: { name, sleepDate: date },
        optimisticResponse: ({ name }) => ({
          removeSleepVariable: {
            date,
            variables: [
              ...(sleepForDate?.variables?.filter((v) => v?.name !== name) ??
                []),
            ],
          },
        }),
        update: (cache, { data: newData }) => {
          const oldData = cache.readQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
          });

          if (!oldData || !newData || !oldData.currentUser || !sleepForDate) {
            return;
          }

          cache.writeQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
            data: {
              currentUser: {
                ...oldData.currentUser,
                todaysSleep: [
                  {
                    ...sleepForDate,
                    variables: newData.removeSleepVariable?.variables,
                  },
                ],
              },
            },
          });
        },
      });
    },
    [date, removeVariableMut, sleepForDate],
  );

  const addVariable = useCallback(
    (name: string, emoji: string, custom: boolean) => {
      addVariableMut({
        variables: { name, emoji, custom, sleepDate: date },
        optimisticResponse: ({ sleepDate, ...rest }) => ({
          addSleepVariable: {
            date,
            variables: [...(sleepForDate?.variables ?? []), rest],
          },
        }),
        update: (cache, { data: newData }) => {
          const oldData = cache.readQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
          });

          if (!oldData || !newData || !oldData.currentUser || !sleepForDate) {
            return;
          }

          cache.writeQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
            data: {
              currentUser: {
                ...oldData.currentUser,
                todaysSleep: [
                  {
                    ...sleepForDate,
                    variables: newData.addSleepVariable?.variables,
                  },
                ],
              },
            },
          });
        },
      });
    },
    [addVariableMut, date, sleepForDate],
  );

  const createVariable = useCallback(
    (name: string, emoji: string) => {
      createSleepVariableMut({
        variables: {
          emoji,
          name,
        },
        optimisticResponse: {
          createSleepVariable: {
            custom: true,
            emoji,
            name,
          },
        },
        update: (cache, { data: newData }) => {
          if (!sleepVariables || !sleepVariables.currentUser) return;

          cache.modify({
            id: cache.identify(sleepVariables.currentUser),
            fields: {
              sleepVariables: () => [
                ...(sleepVariables?.currentUser?.sleepVariables ?? []),
                newData?.createSleepVariable,
              ],
            },
          });
        },
      });
    },
    [createSleepVariableMut, sleepVariables],
  );

  const joinedVariables = useMemo(
    () => [
      ...Sleep.defaultVariables,
      ...(sleepVariables?.currentUser?.sleepVariables ?? []),
    ],
    [sleepVariables?.currentUser?.sleepVariables],
  );

  const selectedVariables = sleepForDate?.variables ?? [];

  const ref = useRef<HTMLDivElement>(null);

  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedNewEmoji, setSelectedNewEmoji] = useState<string>("😀");
  const [selectedNewName, setSelectedNewName] = useState<string>("");
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const data = await import("@emoji-mart/data");
        const { Picker } = await import("emoji-mart");
        new Picker({
          ref,
          data,
          onEmojiSelect: (e) => {
            setSelectedNewEmoji(e.native);
            setChanged(true);
            setShowEmoji(false);
          },
        });
      }
    })();
  }, [showEmoji]);

  const makeEmoji = useEmojiFactory();

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
        <div className="flex items-center justify-between gap-x-4 px-4 py-3">
          <div className="flex items-center gap-x-4">
            <button
              className={classNames({ "saturate-0": !changed })}
              onClick={() => setShowEmoji((p) => !p)}
            >
              {makeEmoji(selectedNewEmoji, "2rem")}
            </button>
            <TextInput
              value={selectedNewName}
              onChange={(e) => setSelectedNewName(e.target.value)}
            />
            {showEmoji && <div className="fixed top-20" ref={ref} />}
          </div>
          <button
            className="flex gap-x-2 p-1"
            onClick={() => createVariable(selectedNewName, selectedNewEmoji)}
          >
            <PlusCircleIcon className="w-8 text-gray-600" />
            <span>Add</span>
          </button>
        </div>
        {joinedVariables.map((variable) => {
          if (!variable) return null;
          const { name, emoji, custom } = variable;
          return (
            <SleepVariable
              key={name}
              active={selectedVariables.some((v) => v?.name === name)}
              emoji={emoji ?? ""}
              name={name}
              onClick={() => {
                if (selectedVariables.some((v) => v?.name === name)) {
                  return removeVariable(name);
                }
                return addVariable(name, emoji ?? "", custom);
              }}
            />
          );
        })}
      </div>
    </Layout.Page>
  );
};

export default Index;
