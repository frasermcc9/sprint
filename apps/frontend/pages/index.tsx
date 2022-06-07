import {
  Layout,
  SignInButton,
  useSignInButtonController,
  useStandardRedirect,
} from "@sprint/components";
import { useCurrentUserLazyQuery } from "@sprint/gql";

export default function Index() {
  const [execute] = useCurrentUserLazyQuery();
  useStandardRedirect();

  return (
    <Layout.Page>
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-indigo-600">
              Start your free trial today.
            </span>
            <span className="font-palanquin block text-7xl font-extrabold tracking-normal text-indigo-600">
              April
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <SignInButton useController={useSignInButtonController} />
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button
                onClick={async () => {}}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout.Page>
  );
}
