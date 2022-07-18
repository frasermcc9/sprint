import { toYYYYMMDD } from "@sprint/common";
import { Layout, TextInput } from "@sprint/components";
import { useRouter } from "next/router";
import React, { useState } from "react";

export const RecordPage: React.FC = () => {
  const { back } = useRouter();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("01:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("01:00");
  const [feedback, setFeedback] = useState("10");
  return (
    <Layout.Page animation={Layout.PageUpAnimation}>
      <Layout.Header>
        <div className="font-palanquin flex w-full items-center border-b-2 border-gray-300 py-2 text-gray-700">
          <div className="invisible mx-8 w-32" />
          <div className="w-full text-center text-xl font-bold">Record Run</div>
          <span
            className="mx-8 w-32 cursor-pointer text-xl font-bold text-indigo-600"
            onClick={back}
          >
            cancel
          </span>
        </div>
      </Layout.Header>
      <Layout.Margin>
        <section className="font-palanquin flex h-full flex-grow flex-col">
          <h1 className="mb-4 text-2xl font-semibold text-gray-800">New Run</h1>
          <div className="flex flex-col items-center justify-center gap-y-2">
            <div className="w-full">
              <label
                className="ml-0.5 text-sm font-semibold underline"
                htmlFor="start-date"
              >
                Start Date
              </label>
              <TextInput
                id="start-date"
                value={toYYYYMMDD(startDate ? new Date(startDate) : new Date())}
                onChange={(e) => {
                  setStartDate(toYYYYMMDD(e.target.valueAsDate));
                }}
                type="date"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-2">
            <div className="w-full">
              <label
                className="ml-0.5 text-sm font-semibold underline"
                htmlFor="start-time"
              >
                Start Time
              </label>
              <TextInput
                id="start-time"
                value={startTime}
                type="time"
                onChange={(e) => setStartTime(e.target.value)}
              ></TextInput>
            </div>
          </div>
          <div className="w-full">
            <label
              className="ml-0.5 text-sm font-semibold underline"
              htmlFor="end-date"
            >
              End Date
            </label>
            <TextInput
              id="end-date"
              value={toYYYYMMDD(endDate ? new Date(endDate) : new Date())}
              onChange={(e) => {
                setEndDate(toYYYYMMDD(e.target.valueAsDate));
              }}
              type="date"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-y-2">
            <div className="w-full">
              <label
                className="ml-0.5 text-sm font-semibold underline"
                htmlFor="end-time"
              >
                End Time
              </label>
              <TextInput
                id="end-time"
                value={endTime}
                type="time"
                onChange={(e) => setEndTime(e.target.value)}
              ></TextInput>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              <label
                className="ml-0.5 text-sm font-semibold underline"
                htmlFor="feedback"
              >
                Rating of perceived exertion (6-20)
              </label>
              <TextInput
                id="feedback"
                value={feedback}
                type="range"
                min="6"
                max="20"
                onChange={(e) => setFeedback(e.target.value)}
              ></TextInput>
            </div>
            <label className=" text-center ">{feedback}</label>
          </div>
          <button className="my-2 rounded-md bg-indigo-600 p-2 text-gray-50 ">
            Save
          </button>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default RecordPage;
