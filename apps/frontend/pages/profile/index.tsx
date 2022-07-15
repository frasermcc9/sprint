import { CogIcon } from "@heroicons/react/outline";
import { toMonthYYYY } from "@sprint/common";
import { Avatar, Layout, RunCard } from "@sprint/components";
import { useCurrentUserQuery } from "@sprint/gql";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Index() {
  const { data, loading, error } = useCurrentUserQuery();
  const { push } = useRouter();

  if (error) {
    toast.error(error.message);
    return null;
  }

  if (loading || !data?.currentUser) {
    return <div>Loading...</div>;
  }

  const {
    currentUser: { createdAtUTS, id, firstName, lastName, avatarUrl },
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

        <hr className="mt-2"></hr>
        <div className="font-palanquin mt-2 flex flex-col text-gray-600">
          <p className="text-2xl font-semibold text-gray-800">Your Runs</p>
          <span className="mb-2 text-sm font-thin">In the last 90 days</span>
          <RunCard duration="13" rundate="2020-01-01" />
          <RunCard duration="13" rundate="2020-01-01" />
          <RunCard duration="13" rundate="2020-01-01" />
        </div>
      </Layout.Margin>
    </Layout.Page>
  );
}
