import { AccountStage, useCurrentUserQuery } from "@sprint/gql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AUTH_REDIRECT = "/auth";
const EXPERIENCE_REDIRECT = "/onboard";
const INITIAL_RUN_REDIRECT = "/initial";

export const useStandardRedirect = () => {
  const { push } = useRouter();
  const { data, loading, error } = useCurrentUserQuery();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      if (
        error.graphQLErrors.find(
          (f) => f.extensions["code"] === "UNAUTHENTICATED",
        )
      ) {
        push(AUTH_REDIRECT);
      } else {
        toast.error("We couldn't connect to the server. Sorry about that :(");
      }
      return;
    }

    if (!data?.currentUser) {
      push(AUTH_REDIRECT);
      return;
    }

    const { stage } = data.currentUser;

    if (stage === AccountStage.Initial) {
      push(EXPERIENCE_REDIRECT);
      return;
    }

    if (stage === AccountStage.ExperienceLevelSelected) {
      push(INITIAL_RUN_REDIRECT);
      return;
    }

    setAuthenticated(true);
  }, [data, loading, error, push]);

  return { loading, loggedIn: authenticated };
};
