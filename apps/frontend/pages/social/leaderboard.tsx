import {
  Layout,
  LeaderboardComponents,
  useLeaderboardController,
} from "@sprint/components";
import { useRouter } from "next/router";
import React from "react";

const Leaderboard: React.FC = () => {
  const { back } = useRouter();

  return (
    <Layout.Page animation={Layout.PageUpAnimation}>
      <Layout.Header>
        <div className="font-palanquin flex w-full items-center bg-indigo-900 py-2 text-gray-100">
          <div className="invisible mx-8 w-32" />
          <div className="w-full text-center text-xl font-bold">
            Leaderboard
          </div>
          <span
            className="mx-8 w-32 cursor-pointer text-xl font-bold text-indigo-200 "
            onClick={() => back()}
          >
            {"Done"}
          </span>
        </div>
        <div className="relative flex w-full flex-col items-center justify-between bg-indigo-900 text-gray-100 transition-all">
          {/* <div className="absolute left-8 top-2 h-12 w-12 rounded-full bg-indigo-800" />
          <div className="absolute top-20 right-4 h-8 w-8 rounded-full bg-indigo-800" /> */}
          <div className="font-palanquin z-10 flex h-60 w-full flex-col items-center justify-center gap-y-2">
            <LeaderboardComponents.Header
              useController={useLeaderboardController}
            />
          </div>
        </div>
      </Layout.Header>
      <Layout.Margin>
        <div className="mt-4">
          <LeaderboardComponents.List
            useController={useLeaderboardController}
          />
        </div>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default Leaderboard;
