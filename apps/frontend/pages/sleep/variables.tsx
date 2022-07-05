import { Sleep } from "@sprint/common";
import { Layout, SleepVariable } from "@sprint/components";
import {
  MostRecentSleepDocument,
  MostRecentSleepQuery,
  useAddSleepVariableMutation,
  useCustomSleepVariablesQuery,
  useMostRecentSleepQuery,
  useRemoveSleepVariableMutation,
} from "@sprint/gql";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

const Index: React.FC = () => {
  const { back, query } = useRouter();
  const date = query.date as string;

  const { data: sleepData } = useMostRecentSleepQuery();
  const { data: sleepVariables } = useCustomSleepVariablesQuery();

  const [addVariableMut] = useAddSleepVariableMutation();
  const [removeVariableMut] = useRemoveSleepVariableMutation();

  const removeVariable = useCallback(
    (name: string) => {
      removeVariableMut({
        variables: { name, sleepDate: date },
        optimisticResponse: {
          removeSleepVariable: name,
        },
        update: (cache, { data: newData }) => {
          const oldData = cache.readQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
          });

          if (!oldData || !newData || !oldData.currentUser) {
            return;
          }

          cache.writeQuery({
            query: MostRecentSleepDocument,
            data: {
              currentUser: {
                ...oldData.currentUser,
                todaysSleep: {
                  ...oldData.currentUser.todaysSleep,
                  variables:
                    oldData.currentUser?.todaysSleep?.variables?.filter(
                      (v) => v?.name !== name,
                    ),
                },
              },
            },
          });
        },
      });
    },
    [date, removeVariableMut],
  );

  const addVariable = useCallback(
    (name: string, emoji: string, custom: boolean) => {
      addVariableMut({
        variables: { name, emoji, custom, sleepDate: date },
        optimisticResponse: {
          addSleepVariable: {
            name,
            emoji,
            custom,
          },
        },
        update: (cache, { data: newData }) => {
          const oldData = cache.readQuery<MostRecentSleepQuery>({
            query: MostRecentSleepDocument,
          });

          if (!oldData || !newData || !oldData.currentUser) {
            return;
          }

          cache.writeQuery({
            query: MostRecentSleepDocument,
            data: {
              currentUser: {
                ...oldData.currentUser,
                todaysSleep: {
                  ...oldData.currentUser.todaysSleep,
                  variables: [
                    ...(oldData.currentUser.todaysSleep?.variables ?? []),
                    newData?.addSleepVariable,
                  ],
                },
              },
            },
          });
        },
      });
    },
    [addVariableMut, date],
  );

  const joinedVariables = useMemo(
    () => [
      ...Sleep.defaultVariables,
      ...(sleepVariables?.currentUser?.sleepVariables ?? []),
    ],
    [sleepVariables?.currentUser?.sleepVariables],
  );

  const selectedVariables =
    sleepData?.currentUser?.todaysSleep?.variables ?? [];

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
        <div></div>
      </div>
    </Layout.Page>
  );
};

export default Index;
