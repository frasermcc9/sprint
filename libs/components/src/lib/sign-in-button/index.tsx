import React, { useCallback } from "react";
import { FitbitSmallWhite } from "@sprint/assets";
import { useGetAuthUrlQuery } from "@sprint/gql";
import Image from "next/image";

export interface SignInButtonProps {
  useController: typeof useSignInButtonController;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  useController,
}) => {
  const { onClick } = useController();

  return (
    <div className="w-max max-w-xs rounded-lg bg-[#00B0B9] py-2 px-4 shadow transition-all hover:brightness-110 active:hover:brightness-95">
      <button className="flex w-full items-center gap-x-2" onClick={onClick}>
        <Image
          src={FitbitSmallWhite}
          className="w-10"
          width="40px"
          height="40px"
          alt=""
        />
        <div className="font-palanquin text-lg font-medium text-white">
          Continue With FitBit
        </div>
      </button>
    </div>
  );
};

export const useSignInButtonController = () => {
  const { data } = useGetAuthUrlQuery();

  const onClick = useCallback(() => {
    if (data) {
      window.location.href = data.getAuthLink;
    }
  }, [data]);

  return { onClick };
};

export const useMockSignInButtonController: typeof useSignInButtonController =
  () => {
    const onClick = useCallback(() => {
      console.log("Do login");
      return null;
    }, []);

    return { onClick };
  };

export default SignInButton;
