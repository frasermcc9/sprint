import {
  Layout,
  SignInButton,
  useSignInButtonController,
  useStandardRedirect,
} from "@sprint/components";

export default function Index() {
  useStandardRedirect();

  return <Layout.Page></Layout.Page>;
}
