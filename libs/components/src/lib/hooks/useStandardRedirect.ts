import { LocalStorageKeys } from "@sprint/common";
import {
  AccountStage,
  InRun,
  useCurrentUserLazyQuery,
  useUpdateInRunMutation,
} from "@sprint/gql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useExternalLog as externalLog } from "./useLog";

const AUTH_REDIRECT = "/auth";
const EXPERIENCE_REDIRECT = "/onboard";
const INITIAL_RUN_REDIRECT = "/home";

export const useStandardRedirect = () => {
  const router = useRouter();
  const [getCurrentUser] = useCurrentUserLazyQuery();
  const [authenticated, setAuthenticated] = useState(false);

  const [execInRunUpdate] = useUpdateInRunMutation();

  useEffect(() => {
    const pushIfDifferent = (route: string) => {
      if (router.pathname !== route) {
        externalLog("Different route! Redirecting to", route);
        router.push(route);
      }
    };

    (async () => {
      if (
        !localStorage.getItem(LocalStorageKeys.AUTH_DETAILS) ||
        !localStorage.getItem(LocalStorageKeys.AUTH_EXPIRY)
      ) {
        pushIfDifferent(AUTH_REDIRECT);
        return;
      }

      const { data, loading, error } = await getCurrentUser();

      if (loading) {
        return;
      }

      if (error) {
        if (
          error.graphQLErrors.find(
            (f) => f.extensions["code"] === "UNAUTHENTICATED",
          )
        ) {
          pushIfDifferent(AUTH_REDIRECT);
        } else {
          toast.error("We couldn't connect to the server. Sorry about that :(");
        }
        return;
      }

      if (!data?.currentUser) {
        externalLog("Redirect", "No current user found, redirecting to login");
        pushIfDifferent(AUTH_REDIRECT);
        return;
      }

      setAuthenticated(true);
      const { stage } = data.currentUser;

      if (stage === AccountStage.Initial) {
        externalLog("Redirect", "Redirecting to onboarding page");
        pushIfDifferent(EXPERIENCE_REDIRECT);
        return;
      }

      if (
        stage === AccountStage.ExperienceLevelSelected &&
        (router.pathname === EXPERIENCE_REDIRECT || router.pathname === "/")
      ) {
        externalLog("Redirect", "Redirecting to home page");
        pushIfDifferent(INITIAL_RUN_REDIRECT);
        return;
      }

      if (data?.currentUser.inRun === InRun.Yes) {
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

      if (data?.currentUser.inRun === InRun.Feedback) {
        externalLog("Redirect", "Doing run feedback");
        pushIfDifferent("/run/feedback");
      }
    })();
  }, [execInRunUpdate, getCurrentUser, router]);

  return { loggedIn: authenticated };
};
