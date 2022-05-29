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
          localStorage.setItem("auth_details", JSON.stringify(login));
        }
      });
    }
  }, [isReady, code, doLogin]);

  return {};
};

export const useMockGetTokenPageController: typeof useGetTokenPageController =
  () => {
    return {};
  };

export default GetTokenPage;
