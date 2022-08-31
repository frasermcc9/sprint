import { Numbers } from "@sprint/common";
import { Layout } from "@sprint/components";
import { useCurrentUserQuery, usePrepareRunQuery } from "@sprint/gql";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";

const RunActivePage: React.FC = () => {
  const { push } = useRouter();

  const { data: userQuery } = useCurrentUserQuery();

  const start = useMemo(
    () => userQuery?.currentUser?.nextRunStart,
    [userQuery?.currentUser?.nextRunStart],
  );
  const end = useMemo(
    () => userQuery?.currentUser?.nextRunEnd,
    [userQuery?.currentUser?.nextRunEnd],
  );

  const { data } = usePrepareRunQuery({
    variables: {
      duration: ~~(
        new Date(end ?? Date.now()).getTime() -
        new Date(start ?? Date.now()).getTime()
      ),
    },
    skip: !start || !end,
  });

  const startTime = new Date(start ?? Date.now()).getTime();
  const endTime = new Date(end ?? Date.now()).getTime();

  const [now, setNow] = React.useState(Date.now());
  const [minutes, setMinutes] = React.useState(
    Math.floor((endTime - now) / 1000 / 60),
  );
  const [seconds, setSeconds] = React.useState(
    Math.floor((endTime - now) / 1000) % 60,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      const endTime = new Date(end ?? Date.now()).getTime();

      setMinutes(Math.floor((endTime - now) / 1000 / 60));
      setSeconds(Math.floor((endTime - now) / 1000) % 60);

      if (now > endTime) {
        clearInterval(interval);
        setTimeout(() => {
          push("/");
        }, 1000);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const phases = useMemo(() => {
    const phases: [number, string][] = [];
    const { lowIntensity, highIntensity, repetitions, restPeriod, sets } =
      data?.prepRun ?? {};

    let currentTime = 0;

    for (let i = 0; i < (sets ?? 0); i++) {
      for (let j = 0; j < (repetitions ?? 0); j++) {
        phases.push([currentTime, `Low Intensity (${lowIntensity}s)`]);
        currentTime += highIntensity ?? 0;

        phases.push([currentTime, `High Intensity (${highIntensity}s)`]);
        currentTime += lowIntensity ?? 0;
      }
      phases.push([currentTime, `Rest Period (${restPeriod}s)`]);
      currentTime += restPeriod ?? 0;
    }
    return phases;
  }, [data]);

  const currentPhase = useMemo(() => {
    const startTime = new Date(start ?? Date.now()).getTime();

    const progress = (now - startTime) / 1000;

    const phaseIndex = phases.findIndex(([time]) => time > progress) - 1;
    return phaseIndex;
  }, [now, phases, start]);

  const fiveSurroundingPhases = useMemo(() => {
    const nearestIndices: number[] = [currentPhase];

    let magnitude = 1;
    while (nearestIndices.length < 5) {
      if (magnitude > phases.length) {
        break;
      }
      if (currentPhase - magnitude >= 0) {
        nearestIndices.push(currentPhase - magnitude);
      }
      if (currentPhase + magnitude < phases.length) {
        nearestIndices.push(currentPhase + magnitude);
      }
      magnitude++;
    }
    return nearestIndices.sort((a, b) => a - b);
  }, [currentPhase, phases.length]);

  return (
    <Layout.Page
      animation={{
        hidden: { opacity: 0, x: 0, y: 200 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 0, y: 200 },
      }}
    >
      <Layout.Margin>
        <section className="font-palanquin flex h-full flex-grow flex-col">
          <section className="mx-4 mt-8 flex flex-grow flex-col">
            <div className="flex items-center justify-between">
              <h1 className="mb-4 text-3xl font-bold">Enjoy the Run!</h1>
            </div>
            <div suppressHydrationWarning>
              {typeof window !== "undefined" && (
                <div className="flex flex-col items-center justify-center gap-y-1">
                  <div className="text-xl font-semibold">Timer</div>
                  <div className="mb-8 flex w-40 items-center justify-center rounded-lg border-4 border-indigo-600 px-4 pt-2 pb-4 text-4xl font-bold">
                    {Numbers.leadingZeros(minutes, 2)}:
                    {Numbers.leadingZeros(seconds, 2)}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center gap-y-1">
              <div className="text-xl font-semibold">Phases</div>
              <div
                className={classNames(
                  "flex flex-col gap-y-1 text-lg font-normal",
                  {
                    "phases-early": currentPhase === 0 || currentPhase === 1,
                    "phases-late":
                      currentPhase === phases.length - 1 ||
                      currentPhase === phases.length - 2,
                    "phases-norm": ![
                      0,
                      1,
                      phases.length - 1,
                      phases.length - 2,
                    ].includes(currentPhase),
                  },
                )}
              >
                {fiveSurroundingPhases.map((index, mapIndex) => {
                  const [time, name] = phases.at(index) ?? [0, ""];

                  const timeFromEnd = (endTime - startTime) / 1000 - time;
                  return (
                    <ul
                      key={index}
                      className={classNames(
                        `flex items-center justify-center gap-x-4`,
                        {
                          "text-indigo-600": index === currentPhase,
                          "text-gray-600": index !== currentPhase,
                          "": mapIndex === 4,
                        },
                      )}
                    >
                      <div>{name}</div>
                      <div className="flex gap-x-4">
                        {Numbers.leadingZeros(Math.floor(timeFromEnd / 60), 2)}:
                        {Numbers.leadingZeros(timeFromEnd % 60, 2)}
                      </div>
                    </ul>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mb-8 flex flex-col items-center">
            <div>
              <button
                className="disabled:true w-36  rounded-full bg-gray-300 px-8 py-2 text-lg font-semibold text-gray-900"
                onClick={() => push("/home")}
              >
                Close
              </button>
            </div>
          </section>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default dynamic(() => Promise.resolve(RunActivePage), {
  ssr: false,
});
