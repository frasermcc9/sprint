import {
  Layout,
  useEmojiFactory,
  useStandardRedirect,
} from "@sprint/components";
import { useGetDailyGoalsQuery } from "@sprint/gql";
import classNames from "classnames";

export default function Index() {
  const { data } = useGetDailyGoalsQuery();

  const createEmoji = useEmojiFactory();

  useStandardRedirect();

  return (
    <Layout.Page animation={Layout.PageUpAnimation}>
      <Layout.Header>
        <div className="font-palanquin mb-4 flex w-full items-center border-b-2 border-gray-300 py-2 text-gray-700">
          <div className="w-full text-center text-xl font-bold">Goals</div>
        </div>
      </Layout.Header>
      <Layout.Margin>
        <div className="font-palanquin mb-2 text-2xl font-medium">
          Daily Goals
        </div>
        {data ? (
          <div className="flex flex-col gap-y-2">
            {data.currentUser?.dailyGoals.map((goal, index) => {
              const percent = goal.completed / goal.quantity;
              const unfilled = 1 - percent;

              const [widthPercent, unfilledPercent, completed] = [
                percent * 100,
                unfilled * 100,
                goal.completed >= goal.quantity,
              ];

              return (
                <div
                  key={index}
                  className="font-palanquin w-full rounded-2xl border border-gray-500 p-4"
                >
                  <div className="flex items-center gap-x-8">
                    <div>
                      {createEmoji(completed ? "✅" : goal.emoji, "64px")}
                    </div>
                    <div className="flex w-full flex-col gap-y-1">
                      <h1
                        className={classNames("text-xl font-medium", {
                          "underline underline-offset-[-0.4em]": completed,
                        })}
                        style={{ textDecorationSkipInk: "none" }}
                      >
                        {goal.description}
                      </h1>
                      <div className="flex items-center gap-x-2">
                        <div className="relative flex w-full items-center">
                          <div
                            className={classNames(
                              "rounded-l-full bg-amber-500 py-2",
                              {
                                "rounded-r-full": percent === 1,
                              },
                            )}
                            style={{ width: `${widthPercent}%` }}
                          />
                          <div
                            className={classNames(
                              "w-1/2 rounded-r-full bg-neutral-500 py-2",
                              {
                                "rounded-l-full": percent === 0,
                              },
                            )}
                            style={{ width: `${unfilledPercent}%` }}
                          />
                          <div
                            className="absolute right-0 bottom-0 -rotate-12 text-3xl font-bold text-emerald-400"
                            style={{
                              textShadow: "1px 2px 3px rgba(0,0,0,0.5)",
                            }}
                          >
                            {goal.reward}XP
                          </div>
                        </div>
                        <div className="w-max whitespace-pre text-lg">
                          {goal.completed} / {goal.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-24 w-full">Loading</div>
        )}
        <div className="font-palanquin my-2 text-2xl font-medium">
          Weekly Goals
        </div>
      </Layout.Margin>
    </Layout.Page>
  );
}
