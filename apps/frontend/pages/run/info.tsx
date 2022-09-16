import { Layout } from "@sprint/components";
import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";

export const Prepare: React.FC = () => {
  const { back } = useRouter();
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
              <h1 className="text-3xl font-bold">More Info</h1>
            </div>
            <div className="mt-2">Each run is made up of 3 phases:</div>
            <div className="mt-2 h-36 rounded-lg border border-black bg-gray-200 p-2">
              <p className="font-bold text-indigo-600">High Intensity</p>
              <p className="font-bold">Sprinting</p>
              <p>
                For this phase you are aiming to maintain just under your
                maximum pace (80-90% effort).
              </p>
            </div>
            <div className="mt-2 h-36 rounded-lg border border-black bg-gray-200 p-2">
              <p className="font-bold text-indigo-600">Low Intensity</p>
              <p className="font-bold">Jogging</p>
              <p>
                For this phase you are aiming to maintain a light jog (70-80%
                effort).
              </p>
            </div>
            <div className="mt-2 h-36 rounded-lg border border-black bg-gray-200 p-2">
              <p className="font-bold text-indigo-600">Rest</p>
              <p className="font-bold">Walking </p>
              <p>
                For this phase you focusing on resting and recovering for the
                next set.
              </p>
            </div>
          </section>

          <section className="mb-8 flex flex-col items-center">
            <div className={classNames("mb-3 transition-opacity duration-500")}>
              <button
                className=" w-36 rounded-full bg-gray-300 px-8 py-2 text-lg font-semibold text-gray-900"
                onClick={back}
              >
                Back
              </button>
            </div>
          </section>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default Prepare;
