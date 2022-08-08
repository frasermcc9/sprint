import {
  FriendsList,
  Layout,
  Leaderboard,
  useFriendsListController,
  useLeaderboardController,
} from "@sprint/components";

export default function Index() {
  return (
    <Layout.Page>
      <Layout.Header>
        <div className="font-palanquin mb-4 flex w-full items-center border-b-2 border-gray-300 py-2 text-gray-700">
          <div className="w-full text-center text-xl font-bold">Social</div>
        </div>
      </Layout.Header>
      <Layout.Margin>
        <section className="flex w-full flex-col items-center justify-between">
          <div className="font-palanquin flex w-full flex-col text-gray-600">
            <Leaderboard useController={useLeaderboardController} />
          </div>
          <div className="font-palanquin flex w-full flex-col text-gray-600">
            <FriendsList useController={useFriendsListController} />
          </div>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
}
