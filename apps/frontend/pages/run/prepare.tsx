import {
  CircularProgress,
  Layout,
  NativeModal,
  useColorRule,
  useInterval,
} from "@sprint/components";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  CurrentUserDocument,
  CurrentUserQuery,
  InRun,
  usePrepareRunQuery,
  useUpdateInRunMutation,
  useUpdateNextRunTimesMutation,
} from "@sprint/gql";
import { time } from "console";

export const Prepare: React.FC = () => {
  const { back, push } = useRouter();
  let runDuration = 13;

  if (typeof window != undefined) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    runDuration = parseInt(urlParams.get("duration") ?? "13", 10);
  }

  const [execInRunUpdate] = useUpdateInRunMutation();
  const [execNextRunUpdate] = useUpdateNextRunTimesMutation();

  const { data, loading, error } = usePrepareRunQuery({
    variables: {
      duration: runDuration,
    },
  });
  if (error) {
    console.log(error.message);
  }

  const sections = [
    `Your run will be ~ ${runDuration} minutes`,
    `Each low intensity section will be ${data?.prepRun?.lowIntensity} seconds`,
    `Each high intensity section will be ${data?.prepRun?.highIntensity} seconds`,
    `Number of reps will be ${data?.prepRun?.repetitions}`,
    `Each rest period will be ${data?.prepRun?.restPeriod} seconds`,
    `Number of sets will be ${data?.prepRun?.sets}`,
  ];

  const duration = 6;
  const sectionCount = sections.length;

  const [visibleSections, setSectionVisibility] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const colorize = useColorRule([
    { test: /[1-9]+/, className: "text-indigo-600 font-semibold" },
  ]);

  useInterval({
    update: () => setSectionVisibility((p) => p + 1),
    isComplete: () => visibleSections >= sectionCount,
    rate: (duration / (sectionCount + 1)) * 1000,
  });

  useEffect(() => {
    setTimeout(() => setShowButton(true), 5500);
  }, []);

  const startRun = () => {
    const timestamp = new Date();
    const nextRunStart = timestamp.toString();
    const nextRunEnd = new Date(
      timestamp.getTime() + runDuration * 60 * 1000,
    ).toString();
    console.log(nextRunStart, nextRunEnd);
    execNextRunUpdate({
      variables: {
        nextRunStart,
        nextRunEnd,
      },
      optimisticResponse: {
        updateNextRunTimes: {
          nextRunStart,
          nextRunEnd,
        },
      },
      update: (cache, { data: updated }) => {
        const old = cache.readQuery<CurrentUserQuery>({
          query: CurrentUserDocument,
        });

        if (!updated || !old || !old.currentUser) {
          return;
        }

        cache.writeQuery<CurrentUserQuery>({
          query: CurrentUserDocument,
          data: {
            ...old,
            currentUser: {
              ...old.currentUser,
              nextRunStart,
              nextRunEnd,
            },
          },
        });
      },
    });

    const inRun = InRun.Yes;
    execInRunUpdate({
      variables: {
        inRun,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateInRun: {
          inRun,
          __typename: "User",
        },
      },
      update: (cache, { data: updated }) => {
        const old = cache.readQuery<CurrentUserQuery>({
          query: CurrentUserDocument,
        });

        if (!updated || !old || !old.currentUser) {
          return;
        }

        cache.writeQuery<CurrentUserQuery>({
          query: CurrentUserDocument,
          data: {
            ...old,
            currentUser: {
              ...old.currentUser,
              inRun,
            },
          },
        });
      },
    });

    push("/run/active");
  };

  return (
    <Layout.Page
      animation={{
        hidden: { opacity: 0, x: 0, y: 200 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 0, y: 200 },
      }}
    >
      <Layout.Margin>
        <NativeModal
          action={startRun}
          actionText="Let's Go!"
          title="Confirmation"
          closeModal={() => setIsOpen(false)}
          isOpen={isOpen}
          text={`Make sure you are warmed up and ready to go!`}
        />
        <section className="font-palanquin flex h-full flex-grow flex-col">
          <section className="mx-4 mt-8 flex flex-grow flex-col">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Preparing Run...</h1>
              <div className="w-12">
                <CircularProgress duration={5} mode="auto" />
              </div>
            </div>
            <div className="ml-4 mt-8 flex flex-col gap-y-6">
              {sections.map((section, index) => {
                const isVisible = index < visibleSections + 1;
                return (
                  <ul
                    key={index}
                    className={classNames("transition-opacity duration-500", {
                      "opacity-0": !isVisible,
                      "opacity-100": isVisible,
                    })}
                  >
                    <div className="flex items-center gap-x-4">
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      <span className="leading-tight">{colorize(section)}</span>
                    </div>
                  </ul>
                );
              })}
            </div>
          </section>

          <section className="mb-8 flex flex-col items-center">
            <div
              className={classNames("mb-3 transition-opacity duration-500", {
                "opacity-0": !showButton,
                "opacity-100": showButton,
              })}
            >
              <button
                className=" w-36 rounded-full bg-gray-300 px-8 py-2 text-lg font-semibold text-gray-900"
                onClick={() => setIsOpen(true)}
              >
                Continue
              </button>
            </div>
            <div>
              <button
                className=" w-36  rounded-full bg-gray-300 px-8 py-2 text-lg font-semibold text-gray-900"
                onClick={back}
              >
                Undo
              </button>
            </div>
          </section>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default Prepare;
