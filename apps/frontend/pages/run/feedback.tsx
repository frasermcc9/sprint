import { Layout, NativeModal, TextInput } from "@sprint/components";
import { InRun, useCurrentUserQuery } from "@sprint/gql";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Feedback: React.FC = () => {
  const { data, loading, error } = useCurrentUserQuery();
  const [intensityFB, setFeedback] = useState(10);
  const [isOpen, setIsOpen] = useState(false);

  if (loading || !data?.currentUser) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error(error.message);
    return null;
  }

  const saveRun = () => {
    const inRun = InRun.No;
  };

  const {
    currentUser: { nextRunEnd, nextRunStart },
  } = data;
  return (
    <Layout.Page
      animation={{
        hidden: { opacity: 0, x: 0, y: 200 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 0, y: 200 },
      }}
    >
      <NativeModal
        action={saveRun}
        actionText="Confirm"
        title="Confirmation"
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
        text={`Please make sure your FitBit Watch is synced with your FitBit app before continuing.`}
      />
      <Layout.Margin>
        <section className="font-palanquin flex h-full flex-grow flex-col">
          <section className="mx-4 mt-8 flex flex-grow flex-col">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Run FeedBack</h1>
            </div>

            <div>
              <p className="my-2">Please enter your feedback for the run:</p>
              <p className="">
                <b>Starting:</b> {nextRunStart.split("GMT")[0]}
              </p>
              <p className="mb-1">
                <b>Ending:</b> {nextRunEnd.split("GMT")[0]}
              </p>
            </div>

            <table className="text-center">
              <thead>
                <tr>
                  <th>Intensity</th>
                  <th>Definition</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-emerald-700">
                  <td>6</td>
                  <td>No exertion</td>
                </tr>
                <tr className="text-emerald-600">
                  <td>7</td>
                  <td>Extremely Light</td>
                </tr>
                <tr className="text-emerald-500">
                  <td>8</td>
                  <td></td>
                </tr>
                <tr className="text-emerald-400">
                  <td>9</td>
                  <td>Very Light</td>
                </tr>
                <tr className="text-emerald-300">
                  <td>10</td>
                  <td></td>
                </tr>
                <tr className="text-lime-500">
                  <td>11</td>
                  <td>Comfortable with some effort</td>
                </tr>
                <tr className="text-lime-400">
                  <td>12</td>
                  <td></td>
                </tr>
                <tr className="text-yellow-300">
                  <td>13</td>
                  <td>Somewhat Hard</td>
                </tr>
                <tr className="text-yellow-400">
                  <td>14</td>
                  <td></td>
                </tr>
                <tr className="text-amber-400">
                  <td>15</td>
                  <td>Hard</td>
                </tr>
                <tr className="text-amber-500">
                  <td>16</td>
                  <td></td>
                </tr>
                <tr className="text-amber-600">
                  <td>17</td>
                  <td>Vigorous Activity</td>
                </tr>
                <tr className="text-orange-500">
                  <td>18</td>
                  <td>Hard Intensity</td>
                </tr>
                <tr className="text-orange-600">
                  <td>19</td>
                  <td>Very Hard Intensity</td>
                </tr>
                <tr className="text-red-600">
                  <td>20</td>
                  <td>Maximum effort</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-2 flex flex-col items-center justify-center">
              <div className="w-full">
                <label
                  className="ml-0.5 text-sm font-semibold underline"
                  htmlFor="feedback"
                >
                  Rating of perceived exertion (6-20)
                </label>
                <TextInput
                  id="feedback"
                  value={intensityFB.toString()}
                  type="range"
                  min="6"
                  max="20"
                  onChange={(e) => setFeedback(parseInt(e.target.value))}
                ></TextInput>
              </div>
              <label className=" text-center ">{intensityFB}</label>
            </div>
          </section>

          <section className="mb-8 flex flex-col items-center">
            <div>
              <button
                className=" w-36  rounded-full bg-gray-300 px-8 py-2 text-lg font-semibold text-gray-900"
                onClick={() => setIsOpen(true)}
              >
                Confirm
              </button>
            </div>
          </section>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default Feedback;
