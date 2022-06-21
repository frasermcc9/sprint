import { LocalStorageKeys, toYYYYMMDD } from "@sprint/common";
import { Avatar, Layout, TextInput, useLoadingState } from "@sprint/components";
import { useCurrentUserQuery, useUpdateProfileMutation } from "@sprint/gql";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useApolloClient } from "@apollo/react-hooks";

export const Settings: React.FC = () => {
  const { push } = useRouter();
  const { data, loading, error } = useCurrentUserQuery();

  const [firstName, setFirstName] = useLoadingState(
    data?.currentUser?.firstName,
  );
  const [lastName, setLastName] = useLoadingState(data?.currentUser?.lastName);
  const [dob, setDob] = useLoadingState(data?.currentUser?.dob);

  const isChanged = useMemo(
    () =>
      !(
        lastName === data?.currentUser?.lastName &&
        firstName === data?.currentUser?.firstName &&
        dob === data?.currentUser?.dob
      ),
    [data, dob, firstName, lastName],
  );
  const [execProfileUpdate] = useUpdateProfileMutation();
  const save = useCallback(() => {
    if (!isChanged) {
      return push("/profile");
    }

    const result = execProfileUpdate({
      variables: {
        dob,
        firstName,
        lastName,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateProfile: {
          dob,
          firstName,
          lastName,
          __typename: "User",
        },
      },
      update: (cache, { data: updated }) => {
        if (!updated?.updateProfile) {
          return;
        }

        cache.modify({
          id: cache.identify(data.currentUser),
          fields: {
            firstName: () => updated.updateProfile.firstName,
            lastName: () => updated.updateProfile.lastName,
            dob: () => updated.updateProfile.dob,
          },
        });
      },
    });

    toast.promise(result, {
      error: "Failed to update your user.",
      pending: "Updating user...",
      success: "Successfully updated your profile!",
    });

    push("/profile");
  }, [
    isChanged,
    execProfileUpdate,
    dob,
    firstName,
    lastName,
    push,
    data?.currentUser,
  ]);

  const { cache } = useApolloClient();

  const logout = useCallback(async () => {
    localStorage.removeItem(LocalStorageKeys.AUTH_DETAILS);
    localStorage.removeItem(LocalStorageKeys.AUTH_EXPIRY);
    push("/");
    await cache.reset();
  }, [cache, push]);

  if (error) {
    toast.error(error.message);
    return null;
  }

  if (loading || !data?.currentUser) {
    return <div>Loading...</div>;
  }

  const {
    currentUser: { avatarUrl },
  } = data;

  return (
    <Layout.Page
      animation={{
        hidden: { opacity: 0, x: 0, y: 200 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 0, y: 200 },
      }}
    >
      <Layout.Header>
        <div className="font-palanquin flex w-full items-center border-b-2 border-gray-300 py-2 text-gray-700">
          <div className="invisible mx-8 w-8" />
          <div className="w-full text-center text-xl font-bold">Settings</div>
          <span
            className="mx-8 w-8 cursor-pointer text-xl font-bold text-indigo-600"
            onClick={save}
          >
            {isChanged ? "Save" : "Done"}
          </span>
        </div>
      </Layout.Header>
      <Layout.Margin>
        <section className="font-palanquin flex h-full flex-grow flex-col">
          <h1 className="mb-4 text-2xl font-semibold text-gray-800">
            Your Profile
          </h1>
          <div className="flex flex-col items-center justify-center gap-y-2">
            <Avatar avatarUrl={avatarUrl} showEdit />
            <div className="w-full">
              <label
                className="ml-0.5 text-sm font-semibold underline"
                htmlFor="first-name"
              >
                First Name
              </label>
              <TextInput
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
              />
            </div>
            <div className="w-full">
              <label
                className="ml-0.5 text-sm font-semibold underline"
                htmlFor="last-name"
              >
                Last Name
              </label>
              <TextInput
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
              />
            </div>
            <div className="w-full">
              <label
                className="ml-0.5 text-sm font-semibold underline"
                htmlFor="dob"
              >
                Date of Birth
              </label>
              <TextInput
                id="dob"
                value={toYYYYMMDD(dob ? new Date(dob) : new Date())}
                onChange={(e) => {
                  setDob(toYYYYMMDD(e.target.valueAsDate));
                }}
                type="date"
              />
            </div>
          </div>
        </section>
        <hr className="mt-4 mb-2 border-t border-gray-300" />
        <section className="font-palanquin flex h-full flex-grow flex-col">
          <h1 className="mb-4 text-2xl font-semibold text-gray-800">General</h1>
          <button
            className="rounded-xl bg-indigo-600 py-2 text-xl font-bold text-white"
            onClick={logout}
          >
            Log Out
          </button>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default Settings;
