import { CheckCircleIcon } from "@heroicons/react/solid";
import {
  emblemDescription,
  EmblemImageUnion,
  emblemList,
} from "@sprint/common";
import { EditIcon, Layout, UserCard } from "@sprint/components";
import {
  useCurrentUserQuery,
  useGetAvailableEmblemsQuery,
  useUpdateEmblemMutation,
} from "@sprint/gql";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

export const EmblemPage: React.FC = () => {
  const { back } = useRouter();

  const [updateEmblem] = useUpdateEmblemMutation();

  const { data: currentUserData } = useCurrentUserQuery();
  const { emblem, avatarUrl, xp, firstName, lastName } =
    currentUserData?.currentUser ?? {};

  const { data: availableEmblemsData } = useGetAvailableEmblemsQuery();
  const availableEmblemList =
    availableEmblemsData?.currentUser?.availableEmblems;

  const [newEmblem, setNewEmblem] = useState<EmblemImageUnion | null>(null);

  const displayEmblem = newEmblem ?? emblem;
  const isChanged = newEmblem !== null && newEmblem !== emblem;

  const selectEmblem = useCallback((selected: EmblemImageUnion) => {
    setNewEmblem(selected);
  }, []);

  const save = useCallback(async () => {
    if (isChanged) {
      await updateEmblem({
        variables: {
          emblem: newEmblem,
        },
        optimisticResponse: {
          updateEmblem: newEmblem,
        },
        update: (cache, { data }) => {
          if (data?.updateEmblem && currentUserData?.currentUser) {
            cache.modify({
              id: cache.identify(currentUserData.currentUser),
              fields: { emblem: () => data.updateEmblem },
            });
          }
        },
      });
    }
    back();
  }, [back, currentUserData, isChanged, newEmblem, updateEmblem]);

  return (
    <Layout.Page animation={Layout.PageUpAnimation}>
      <Layout.Header>
        <div className="font-palanquin flex w-full items-center border-b-2 border-gray-300 py-2 text-gray-700">
          <div className="invisible mx-8 w-32" />
          <div className="w-full text-center text-xl font-bold">Emblems</div>
          <span
            className="mx-8 w-32 cursor-pointer text-xl font-bold text-indigo-600"
            onClick={save}
          >
            {isChanged ? "Save" : "Done"}
          </span>
        </div>
      </Layout.Header>
      <Layout.Margin>
        <section className="font-palanquin mt-2 flex w-full flex-col items-center">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800">
            Current Emblem
          </h1>
          {emblem && (
            <UserCard
              emblem={displayEmblem as EmblemImageUnion}
              avatarUrl={avatarUrl}
              xp={xp}
              firstName={firstName}
              lastName={lastName}
            />
          )}
        </section>
        <div className="mb-4 mt-6 h-px w-full bg-indigo-600" />
        <section className="font-palanquin flex w-full flex-col items-center">
          <h1 className="mb-4 text-2xl font-semibold text-gray-800">
            Available Emblems
          </h1>
          <div className="grid grid-cols-2 gap-x-2">
            {emblemList.map((emblem) => {
              const owned = !!availableEmblemList?.includes(emblem);
              return (
                <div
                  key={emblem}
                  className={classNames("relative", {
                    "brightness-50 saturate-50": !owned,
                  })}
                  onClick={() => owned && selectEmblem(emblem)}
                >
                  <UserCard onlyEmblem emblem={emblem} />
                  {owned ? (
                    <EditIcon
                      positionClassName="-top-2 -right-2"
                      Icon={CheckCircleIcon}
                    />
                  ) : (
                    <div className="absolute -top-1 left-0 flex h-full w-full flex-col items-center justify-center text-sm text-white">
                      {emblemDescription[emblem]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </Layout.Margin>
    </Layout.Page>
  );
};

export default EmblemPage;
