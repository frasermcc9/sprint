import { LocalStorageKeys } from "@sprint/common";
import { AccountStage, useCurrentUserLazyQuery } from "@sprint/gql";
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

      if (stage === AccountStage.ExperienceLevelSelected) {
        externalLog("Redirect", "Redirecting to home page");
        pushIfDifferent(INITIAL_RUN_REDIRECT);
        return;
      }
    })();
  }, [getCurrentUser, router]);

  return { loggedIn: authenticated };
};
