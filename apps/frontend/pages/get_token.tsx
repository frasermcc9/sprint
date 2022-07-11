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
    (async () => {
      if (isReady && typeof code === "string") {
        const { data } = await doLogin({
          variables: {
            code,
          },
        });

        if (data?.login?.expires_in) {
          const expiryTime = Date.now() / 1000 + data.login.expires_in - 1000;

          localStorage.setItem(
            LocalStorageKeys.AUTH_DETAILS,
            JSON.stringify(data.login),
          );
          localStorage.setItem(
            LocalStorageKeys.AUTH_EXPIRY,
            expiryTime.toString(),
          );
        }
        push("/");
      }
    })();
  }, [isReady, code, doLogin, push]);

  return {};
};

export const useMockGetTokenPageController: typeof useGetTokenPageController =
  () => {
    return {};
  };

export default GetTokenPage;
