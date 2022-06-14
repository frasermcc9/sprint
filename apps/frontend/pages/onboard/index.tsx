import {
  Layout,
  OnboardingSlides,
  useOnboardingSlidesController,
  useStandardRedirect,
} from "@sprint/components";

const Index: React.FC = () => {
  useStandardRedirect();

  return (
    <Layout.Page className="px-0">
      <div className="mx-auto max-w-7xl py-12 px-4 text-center sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
        <h2 className="font-palanquin text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-indigo-600">Welcome to Sprint</span>
          <span className="block font-medium">
            {"Before gettting started..."}
          </span>
        </h2>
      </div>
      <OnboardingSlides useController={useOnboardingSlidesController} />
    </Layout.Page>
  );
};

export default Index;
