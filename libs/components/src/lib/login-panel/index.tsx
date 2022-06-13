import cx from "classnames";
import { Glass } from "../..";
import SignInButton, { useSignInButtonController } from "../sign-in-button";

export type LoginPanelProps = {};

export const LoginPanel: React.FC<LoginPanelProps> = () => {
  return (
    <Glass className="z-10 mx-4 flex w-full max-w-md flex-col items-center gap-y-10 p-4 text-gray-50">
      <div className="flex flex-col items-center">
        <h1 className="pt-5 text-2xl font-bold">Sign in</h1>
      </div>

      <div className="mx-auto mb-4 w-full px-8">
        <SignInButton useController={useSignInButtonController} />
      </div>
    </Glass>
  );
};

export default LoginPanel;
