import { LocalStorageKeys } from "@sprint/common";
import { useLoginMutation } from "@sprint/gql";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export const GetTokenPage: React.FC = () => {
  useGetTokenPageController();

  return <div></div>;
};

export const useGetTokenPageController = () => {
  const {
    query: { code },
    isReady,
    push,
  } = useRouter();

  const [doLogin] = useLoginMutation();

  useEffect(() => {
    if (isReady && typeof code === "string") {
      doLogin({
        variables: {
          code,
        },
      }).then(({ data: { login } }) => {
        if (login) {
          const expiryTime = Date.now() + login.expires_in - 1000;

          localStorage.setItem(
            LocalStorageKeys.AUTH_DETAILS,
            JSON.stringify(login),
          );
          localStorage.setItem(
            LocalStorageKeys.AUTH_EXPIRY,
            expiryTime.toString(),
          );
        }
        push("/");
      });
    }
  }, [isReady, code, doLogin, push]);

  return {};
};

export const useMockGetTokenPageController: typeof useGetTokenPageController =
  () => {
    return {};
  };

export default GetTokenPage;
