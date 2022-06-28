import { Menu, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import {
  CheckCircleIcon,
  DotsVerticalIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import { Layout, PullToRefresh, TextInput, UserCard } from "@sprint/components";
import {
  GetFriendsDocument,
  GetFriendsQuery,
  useAcceptFriendRequestMutation,
  useGetFriendsQuery,
  useRejectFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@sprint/gql";
import classNames from "classnames";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Add() {
  const [id, setId] = useState("");

  const updateId = (e: React.ChangeEvent<HTMLInputElement>) =>
    setId(e.target.value.toUpperCase().slice(0, 6));

  const { push } = useRouter();

  const { data, loading, refetch } = useGetFriendsQuery();

  const [sendRequest] = useSendFriendRequestMutation();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const [rejectRequest] = useRejectFriendRequestMutation();

  const ref = useRef<HTMLDivElement>();

  return (
    <PullToRefresh ref={ref} onRefresh={() => refetch()}>
      <Layout.Page
        ref={ref}
        animation={{
          hidden: { opacity: 0, x: 0, y: 200 },
          enter: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: 0, y: 200 },
        }}
      >
        <Layout.Header>
          <div className="font-palanquin mb-4 flex w-full items-center border-b-2 border-gray-300 py-2 text-gray-700">
            <div className="invisible mx-8 w-32" />
            <div className="w-full text-center text-xl font-bold">
              Add Friends
            </div>
            <span
              className="mx-8 w-32 cursor-pointer text-xl font-bold text-indigo-600"
              onClick={() => push("/social")}
            >
              {"Done"}
            </span>
          </div>
        </Layout.Header>

        <Layout.Margin>
          <section className="flex w-full flex-col items-center justify-between gap-y-4">
            <div className="font-palanquin flex w-full flex-col">
              <h1 className="font-palanquin mb-1 text-xl font-bold text-gray-800">
                Add Friends by ID
              </h1>
              <div className="flex">
                <TextInput
                  type="text"
                  placeholder="ABC123"
                  value={id}
                  onChange={updateId}
                />
                <button
                  className="my-1 ml-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
                  onClick={async () => {
                    const load = toast.loading("Sending friend request...");
                    try {
                      await sendRequest({
                        variables: { friendId: id },
                      });
                    } catch (e) {
                      toast.error(e.message);
                    }
                    toast.dismiss(load);
                  }}
                >
                  <UserAddIcon className="h-12 w-12 p-1 text-white" />
                </button>
              </div>
            </div>
            <div className="font-palanquin flex w-full flex-col">
              <h1 className="font-palanquin mb-1 text-xl font-bold text-gray-800">
                Friend Requests
              </h1>
              <div className="flex flex-col">
                {!loading &&
                  data?.currentUser?.friendRequests.map((f) => (
                    <div key={f.id} className="relative flex items-center">
                      <UserCard backgroundUrl={"/img/e1.jpg"} {...f}>
                        <div className="absolute right-4 top-8 z-50 text-white">
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <Menu.Button>
                              <DotsVerticalIcon className="h-5 w-5" />
                            </Menu.Button>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="p-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={classNames(
                                          "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                                          {
                                            "bg-red-500 text-white": active,
                                            "text-gray-900": !active,
                                          },
                                        )}
                                        onClick={() => {
                                          rejectRequest({
                                            variables: { friendId: f.id },
                                            optimisticResponse: {
                                              rejectFriendRequest: f.id,
                                            },
                                            update: (cache, { data }) => {
                                              if (data) {
                                                const { currentUser } =
                                                  cache.readQuery<GetFriendsQuery>(
                                                    {
                                                      query: GetFriendsDocument,
                                                    },
                                                  );
                                                cache.writeQuery<GetFriendsQuery>(
                                                  {
                                                    query: GetFriendsDocument,
                                                    data: {
                                                      currentUser: {
                                                        ...currentUser,
                                                        friendRequests:
                                                          currentUser.friendRequests.filter(
                                                            (f) =>
                                                              f.id !==
                                                              data.rejectFriendRequest,
                                                          ),
                                                      },
                                                    },
                                                  },
                                                );
                                              }
                                            },
                                          });
                                        }}
                                      >
                                        <TrashIcon className="mr-2 h-6 w-6" />
                                        Remove
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </UserCard>
                      <button
                        className="my-1 ml-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
                        onClick={async () => {
                          await acceptRequest({
                            variables: {
                              friendId: f.id,
                            },
                            optimisticResponse: {
                              acceptFriendRequest: {
                                ...f,
                              },
                            },
                            update: (cache, { data }) => {
                              if (data?.acceptFriendRequest) {
                                const { currentUser } =
                                  cache.readQuery<GetFriendsQuery>({
                                    query: GetFriendsDocument,
                                  });
                                cache.writeQuery<GetFriendsQuery>({
                                  query: GetFriendsDocument,
                                  data: {
                                    currentUser: {
                                      ...currentUser,
                                      friends: [
                                        ...currentUser.friends,
                                        data.acceptFriendRequest,
                                      ],
                                      friendRequests:
                                        currentUser.friendRequests.filter(
                                          (f) =>
                                            f.id !==
                                            data.acceptFriendRequest.id,
                                        ),
                                    },
                                  },
                                });
                              }
                            },
                          });
                        }}
                      >
                        <CheckCircleIcon className="h-12 w-12 p-1 text-white" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </Layout.Margin>
      </Layout.Page>
    </PullToRefresh>
  );
}
