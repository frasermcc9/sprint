import { CogIcon } from "@heroicons/react/outline";
import { EmblemImageUnion, toMonthYYYY } from "@sprint/common";
import {
  Avatar,
  EditIcon,
  Layout,
  UserCard,
  RunCard,
} from "@sprint/components";
import {
  InRun,
  useCurrentUserQuery,
  useGetAvailableEmblemsQuery,
  useUpdateInRunMutation,
} from "@sprint/gql";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function Index() {
  const { data, loading, error } = useCurrentUserQuery();
  const { push } = useRouter();

  const { data: emblems } = useGetAvailableEmblemsQuery();
  const [execInRunUpdate] = useUpdateInRunMutation();
  console.log(emblems?.currentUser?.availableEmblems);

  if (error) {
    toast.error(error.message);
    return null;
  }

  if (loading || !data?.currentUser) {
    return <div>Loading...</div>;
  }

  if (data?.currentUser.inRun == InRun.Yes) {
    const timeEnd = new Date(data?.currentUser.nextRunEnd).getTime();
    const timeNow = new Date().getTime();
    if (timeEnd < timeNow) {
      const inRun = InRun.Feedback;
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
          if (!updated?.updateInRun || !data?.currentUser) {
            return;
          }

          cache.modify({
            id: cache.identify(data.currentUser),
            fields: {
              inRun: () => updated.updateInRun?.inRun,
            },
          });
        },
      });
    }
  }

  if (data?.currentUser.inRun == InRun.Feedback) {
    push("/run/feedback");
  }

  const {
    currentUser: {
      createdAtUTS,
      id,
      firstName,
      lastName,
      avatarUrl,
      runs,
      emblem,
    },
  } = data;
  return (
    <Layout.Page>
      <Layout.Header>
        <div className="font-palanquin mb-4 flex w-full items-center border-b-2 border-gray-300 py-2 text-gray-700">
          <div className="invisible mx-4 w-8" />
          <div className="w-full text-center text-xl font-bold">Profile</div>
          <CogIcon
            className="mx-4 w-8 cursor-pointer"
            onClick={() => push("/profile/settings")}
          />
        </div>
      </Layout.Header>
      <Layout.Margin>
        <section className="flex items-center justify-between">
          <div className="font-palanquin flex flex-col text-gray-600">
            <span className="text-2xl font-semibold text-gray-800">
              {firstName} {lastName}
            </span>
            <span className="text-md font-normal">{id}</span>
            <span className="text-md font-normal">
              Joined {toMonthYYYY(new Date(createdAtUTS))}
            </span>
          </div>
          <Avatar avatarUrl={avatarUrl} userId={id} showEdit />
        </section>

        <div className="my-2 h-px w-full bg-indigo-600" />
        <section className="flex flex-col items-center">
          <div className="font-palanquin mb-2 text-2xl font-semibold text-gray-800">
            Your Emblem
          </div>
          <div className="relative p-2">
            <UserCard emblem={emblem as EmblemImageUnion} onlyEmblem />
            <EditIcon onClick={() => push("/profile/emblems")} />
          </div>
        </section>

        <hr className="mt-2"></hr>
        <div className="font-palanquin mt-2 flex flex-col text-gray-600">
          <div>
            <span className="mr-5 text-2xl font-semibold text-gray-800">
              Your Runs
            </span>
          </div>
          <span className="mb-2 text-sm font-thin">In the last 90 days</span>

          {runs.length > 0 ? (
            [...runs]
              .reverse()
              .map((run) => (
                <RunCard
                  key={run?.date}
                  duration={run?.duration ?? 0}
                  rundate={run?.date ?? "no date"}
                  feedback={run?.intensityFeedback ?? 0}
                  runObj={run}
                />
              ))
          ) : (
            <div className="text-base font-thin">No runs yet </div>
          )}
        </div>
      </Layout.Margin>
    </Layout.Page>
  );
}
