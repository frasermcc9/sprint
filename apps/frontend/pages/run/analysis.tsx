import { Layout } from "@sprint/components";
import { useRouter } from "next/router";
import React from "react";

const RunAnalysisPage: React.FC = () => {
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
              <h1 className="text-3xl font-bold">Run Analysis</h1>
            </div>
            <div>
              <p>WIP</p>
            </div>
          </section>

          <section className="mb-8 flex flex-col items-center">
            <div>
              <button
                className="disabled:true w-36  rounded-full bg-gray-300 px-8 py-2 text-lg font-semibold text-gray-900"
                onClick={back}
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

export default RunAnalysisPage;
