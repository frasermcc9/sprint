import {
  Layout,
  HomeHeader,
  StartRun,
  useHomeHeaderController,
  useStandardRedirect,
  useStartRunController,
  StartSleep,
  useStartSleepController,
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
        <div className="flex flex-col gap-y-6">
          <StartRun useController={useStartRunController} />
          <StartSleep useController={useStartSleepController} />
        </div>
      </Layout.Margin>
    </Layout.Page>
  );
}
