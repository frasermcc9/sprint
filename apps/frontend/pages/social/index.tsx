import { ChevronRightIcon } from "@heroicons/react/solid";
import {
  FriendsList,
  Layout,
  useFriendsListController,
} from "@sprint/components";
import { useRouter } from "next/router";

export default function Index() {
  const { push } = useRouter();

  return (
    <Layout.Page>
      <Layout.Header>
        <div className="font-palanquin mb-4 flex w-full items-center border-b-2 border-gray-300 py-2 text-gray-700">
          <div className="w-full text-center text-xl font-bold">Social</div>
        </div>
      </Layout.Header>
      <Layout.Margin>
        <section className="mb-8 flex w-full flex-col items-center justify-between">
          <button
            onClick={() => push("/social/leaderboard")}
            className="font-palanquin flex w-full flex-row items-center justify-between text-gray-600"
          >
            <span className="text-2xl font-semibold text-gray-800">
              Leaderboard
            </span>
            <ChevronRightIcon className="mt-1 w-8" />
          </button>
        </section>
        <section className="flex w-full flex-col items-center justify-between">
          <div className="font-palanquin flex w-full flex-col text-gray-600">
            <FriendsList useController={useFriendsListController} />
          </div>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
}
