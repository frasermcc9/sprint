import {
  HomeHeader,
  Layout,
  StartRun,
  StartSleep,
  StartSleepAnalysis,
  useHomeHeaderController,
  useStandardRedirect,
  useStartRunController,
  useStartSleepAnalysisController,
  useStartSleepController,
} from "@sprint/components";

export default function Index() {
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
          <StartSleepAnalysis useController={useStartSleepAnalysisController} />
        </div>
      </Layout.Margin>
    </Layout.Page>
  );
}
