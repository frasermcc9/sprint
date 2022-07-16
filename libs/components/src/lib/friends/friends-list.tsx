import { UserAddIcon } from "@heroicons/react/solid";
import { useGetFriendsQuery } from "@sprint/gql";
import { useRouter } from "next/router";
import React from "react";
import IconButton from "../icon-button";
import UserCard from "../user-card";

export interface FriendsListProps {
  useController: typeof useFriendsListController;
}

export const FriendsList: React.FC<FriendsListProps> = ({ useController }) => {
  const { friends, loading, requests } = useController();

  const { push } = useRouter();

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-800">Friends</span>
        <IconButton Icon={UserAddIcon} onClick={() => push("/social/add")}>
          {(requests?.length ?? 0) > 0 && (
            <div className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
              <span className="font-palanquin mb-1 text-lg font-bold text-white">
                {requests?.length}
              </span>
            </div>
          )}
        </IconButton>
      </div>
      <div className="mx-auto flex flex-col gap-y-2">
        {loading && <div>Loading...</div>}
        {friends?.map((friend) => (
          <UserCard key={friend?.id} {...friend} />
        ))}
      </div>
    </>
  );
};

export const useFriendsListController = () => {
  const { data, loading } = useGetFriendsQuery();

  return {
    friends: data?.currentUser?.friends,
    requests: data?.currentUser?.friendRequests,
    loading,
  };
};

export const useMockFriendsListController: typeof useFriendsListController =
  () => {
    return {
      loading: false,
      friends: [
        {
          firstName: "John",
          avatarUrl: "",
          lastName: "Doe",
          xp: 234,
          id: "0",
          emblem: "Level1",
        },
      ],
      requests: [
        {
          firstName: "Jane",
          avatarUrl: "",
          lastName: "Doe",
          xp: 445,
          id: "1",
          emblem: "Level1",
        },
      ],
    };
  };

export default FriendsList;
