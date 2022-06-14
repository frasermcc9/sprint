import { AccountStage, useCurrentUserQuery } from "@sprint/gql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AUTH_REDIRECT = "/auth";
const EXPERIENCE_REDIRECT = "/onboard";
const INITIAL_RUN_REDIRECT = "/initial";

export const useStandardRedirect = () => {
  const router = useRouter();
  const { data, loading, error } = useCurrentUserQuery();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const pushIfDifferent = (route: string) => {
      if (router.pathname !== route) {
        router.push(route);
      }
    };

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

    const { stage } = data.currentUser;

    if (stage === AccountStage.Initial) {
      pushIfDifferent(EXPERIENCE_REDIRECT);
      return;
    }

    if (stage === AccountStage.ExperienceLevelSelected) {
      pushIfDifferent(INITIAL_RUN_REDIRECT);
      return;
    }

    setAuthenticated(true);
  }, [data?.currentUser, error, loading, router]);

  return { loading, loggedIn: authenticated };
};
