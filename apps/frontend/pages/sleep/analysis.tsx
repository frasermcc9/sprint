import { Layout } from "@sprint/components";
import { useRouter } from "next/router";
import React from "react";

export const SleepAnalysisPage: React.FC = () => {
  const { back } = useRouter();

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
          <div className="w-full text-center text-xl font-bold">
            Sleep Analysis
          </div>
          <span
            className="mx-8 w-32 cursor-pointer text-xl font-bold text-indigo-200 "
            onClick={() => back()}
          >
            {"Done"}
          </span>
        </div>
      </Layout.Header>
      <Layout.Margin></Layout.Margin>
    </Layout.Page>
  );
};

export default SleepAnalysisPage;
