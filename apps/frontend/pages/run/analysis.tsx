import { Layout } from "@sprint/components";
import { useRouter } from "next/router";
import React from "react";
import { RunInput, useAnalyseRunQuery } from "@sprint/gql";
import { toast } from "react-toastify";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RunAnalysisPage: React.FC = () => {
  const { back } = useRouter();
  const router = useRouter();
  const { object } = router.query;
  let runObject: RunInput = {
    date: "",
    duration: 0,
    heartRate: [],
    userId: "",
    vo2max: 0,
  };

  if (typeof object != "undefined") {
    runObject = JSON.parse(object as string);
  } else {
    return <div>No Run Selected</div>;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, loading, error } = useAnalyseRunQuery({
    variables: {
      run: runObject,
    },
  });
  if (error) {
    toast.error(error.message);
    return null;
  }

  if (loading || !data?.generateRunFeedback?.feedbackSummary) {
    return <div>Loading...</div>;
  }

  const {
    generateRunFeedback: {
      //   feedbackSummary,
      //   intensityFeedback,
      lastRunFeedback,
      //   performanceFeedback,
      //   volumeFeedback,
    },
  } = data;

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
              <h1 className="mb-2 text-3xl font-bold">Run Analysis</h1>
            </div>
            <div>
              <p className="text-center">Heart Rate / Time (Min)</p>
              <div className="">
                <LineChart
                  width={320}
                  height={300}
                  data={runObject.heartRate ?? []}
                  margin={{ top: 5, right: 25, left: -25, bottom: 5 }}
                >
                  <YAxis dataKey={(v) => v} />
                  <XAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Line
                    dataKey={(v) => v}
                    stroke="#ff2152"
                    yAxisId={0}
                    dot={false}
                    activeDot={true}
                  />
                </LineChart>
              </div>
              <p>
                <b>RunFeedback:</b> {lastRunFeedback}
              </p>
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
