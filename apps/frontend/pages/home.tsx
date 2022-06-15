import {
  Layout,
  useStandardRedirect,
  StartRun,
  useStartRunController,
  StandardHeader,
  useStandardHeaderController,
} from "@sprint/components";
import { useCurrentUserLazyQuery } from "@sprint/gql";

export default function Index() {
  const [execute] = useCurrentUserLazyQuery();

  useStandardRedirect();

  return (
    <Layout.Page>
      <Layout.Header>
        <StandardHeader useController={useStandardHeaderController} />
      </Layout.Header>
      <Layout.Margin>
        <StartRun useController={useStartRunController} />
      </Layout.Margin>
    </Layout.Page>
  );
}
