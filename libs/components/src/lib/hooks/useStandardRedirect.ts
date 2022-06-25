import { LocalStorageKeys } from "@sprint/common";
import {
  AccountStage,
  useCurrentUserLazyQuery,
  useCurrentUserQuery,
} from "@sprint/gql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
        pushIfDifferent(AUTH_REDIRECT);
        return;
      }

      setAuthenticated(true);
      const { stage } = data.currentUser;

      if (stage === AccountStage.Initial) {
        pushIfDifferent(EXPERIENCE_REDIRECT);
        return;
      }

      if (stage === AccountStage.ExperienceLevelSelected) {
        pushIfDifferent(INITIAL_RUN_REDIRECT);
        return;
      }
    })();
  }, [getCurrentUser, router]);

  return { loggedIn: authenticated };
};
