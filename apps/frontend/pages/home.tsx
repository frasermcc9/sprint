import {
  Layout,
  HomeHeader,
  StartRun,
  useHomeHeaderController,
  useStandardRedirect,
  useStartRunController,
} from "@sprint/components";
import { useCurrentUserLazyQuery } from "@sprint/gql";

export default function Index() {
  const [execute] = useCurrentUserLazyQuery();

  useStandardRedirect();

  return (
    <Layout.Page>
      <Layout.Header>
        <HomeHeader useController={useHomeHeaderController} />
      </Layout.Header>
      <Layout.Margin>
        <StartRun useController={useStartRunController} />
      </Layout.Margin>
    </Layout.Page>
  );
}
