import data from "@emoji-mart/data";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { Sleep } from "@sprint/common";
import {
  Layout,
  SleepVariable,
  TextInput,
  useEmojiFactory,
} from "@sprint/components";
import {
  useCreateSleepVariableMutation,
  useCustomSleepVariablesQuery,
  useTrackVariableMutation,
  useUntrackVariableMutation,
} from "@sprint/gql";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const Index: React.FC = () => {
  const { back } = useRouter();

  const { data: sleepVariables } = useCustomSleepVariablesQuery();

  const [createSleepVariableMut] = useCreateSleepVariableMutation();

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

  const [trackMut] = useTrackVariableMutation();
  const [untrackMut] = useUntrackVariableMutation();

  const trackVariable = useCallback(
    (name: string) => {
      trackMut({
        variables: {
          name,
        },
        optimisticResponse: {
          trackVariable: [
            ...(sleepVariables?.currentUser?.trackedVariables ?? []),
            name,
          ],
        },
        update: (cache, { data: newData }) => {
          if (!sleepVariables || !sleepVariables.currentUser) return;

          console.log({ track: newData });
          cache.modify({
            id: cache.identify(sleepVariables.currentUser),
            fields: {
              trackedVariables: () => newData?.trackVariable,
            },
          });
        },
      });
    },
    [sleepVariables, trackMut],
  );

  const untrackVariable = useCallback(
    (name: string) => {
      untrackMut({
        variables: {
          name,
        },
        optimisticResponse: {
          untrackVariable:
            sleepVariables?.currentUser?.trackedVariables?.filter(
              (v) => v !== name,
            ) ?? [],
        },
        update: (cache, { data: newData }) => {
          if (!sleepVariables || !sleepVariables.currentUser) return;

          console.log({ untrack: newData });

          cache.modify({
            id: cache.identify(sleepVariables.currentUser),
            fields: {
              trackedVariables: () => newData?.untrackVariable,
            },
          });
        },
      });
    },
    [sleepVariables, untrackMut],
  );

  const joinedVariables = useMemo(
    () => [
      ...Sleep.defaultVariables,
      ...(sleepVariables?.currentUser?.sleepVariables ?? []),
    ],
    [sleepVariables?.currentUser?.sleepVariables],
  );

  const selectedVariables = sleepVariables?.currentUser?.trackedVariables ?? [];

  const ref = useRef<HTMLDivElement>(null);

  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedNewEmoji, setSelectedNewEmoji] = useState<string>("😀");
  const [selectedNewName, setSelectedNewName] = useState<string>("");
  const [changed, setChanged] = useState(false);

  const canCreateEmoji = useMemo(
    () => changed && selectedNewName.length,
    [changed, selectedNewName.length],
  );

  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
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
            disabled={!canCreateEmoji}
            onClick={() =>
              canCreateEmoji &&
              createVariable(selectedNewName, selectedNewEmoji)
            }
          >
            <PlusCircleIcon className="w-8 text-gray-600" />
            <span>Add</span>
          </button>
        </div>
        {joinedVariables.map((variable) => {
          if (!variable) return null;
          const { name, emoji } = variable;
          return (
            <SleepVariable
              key={name}
              active={selectedVariables.some((v) => v === name)}
              emoji={emoji ?? ""}
              name={name}
              onClick={() => {
                if (selectedVariables.some((v) => v === name)) {
                  return untrackVariable(name);
                }
                return trackVariable(name);
              }}
            />
          );
        })}
      </div>
    </Layout.Page>
  );
};

export default Index;
