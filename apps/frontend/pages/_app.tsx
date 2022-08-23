import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import {
  CrownFilledIcon,
  CrownOutlineIcon,
  HomeFilledIcon,
  HomeOutlineIcon,
  ProfileFilledIcon,
  ProfileOutlineIcon,
  TrophyFilledIcon,
  TrophyOutlineIcon,
} from "@sprint/assets";
import { LocalStorageKeys, readableTime } from "@sprint/common";
import {
  Navigation,
  Tab,
  useExternalLog,
  useNavigationController,
} from "@sprint/components";
import {
  LoginMutation,
  RefreshDocument,
  RefreshMutation,
  RefreshMutationVariables,
  Sleep,
} from "@sprint/gql";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

const tabs: Tab[] = [
  {
    label: "Home",
    displayActive: HomeFilledIcon,
    displayInactive: HomeOutlineIcon,
    link: "/home",
  },
  {
    label: "Goals",
    displayActive: TrophyFilledIcon,
    displayInactive: TrophyOutlineIcon,
    link: "/goals",
  },
  {
    label: "Profile",
    displayActive: ProfileFilledIcon,
    displayInactive: ProfileOutlineIcon,
    link: "/profile",
  },
  {
    label: "Social",
    displayActive: CrownFilledIcon,
    displayInactive: CrownOutlineIcon,
    link: "/social",
  },
];

console.log(process.env);

const httpLink = createHttpLink({
  uri: `${
    process.env.NODE_ENV === "production"
      ? "https://flatshare.fraserm.cc"
      : "http://localhost:3333"
  }/graphql`,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}\nPath: ${path}\n`,
        locations,
      );
    });
  }
  if (networkError) {
    toast.error("Error: A network error has occurred. Please try again later.");
    console.error(`[Network error]: ${networkError}`);
  }
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const authDetailsStr = localStorage.getItem(LocalStorageKeys.AUTH_DETAILS);

  const loginData: LoginMutation["login"] = authDetailsStr
    ? JSON.parse(authDetailsStr)
    : {};

  if (!loginData) {
    return {
      headers: {
        ...headers,
      },
    };
  }

  const { access_token, refresh_token } = loginData;

  const expireUnixSeconds =
    +(localStorage.getItem(LocalStorageKeys.AUTH_EXPIRY) ?? 0) / 1000;
  const nowUnixSeconds = Date.now() / 1000;

  if (!access_token || !refresh_token) {
    return {
      headers,
    };
  }
  useExternalLog(
    "ApolloAuthentication",
    "FitBit token expiry in " +
      readableTime(+expireUnixSeconds - nowUnixSeconds),
  );

  if (expireUnixSeconds && nowUnixSeconds > expireUnixSeconds) {
    useExternalLog("ApolloAuthentication", "Refreshing token");

    const { data } = await unauthenticatedClient.mutate<
      RefreshMutation,
      RefreshMutationVariables
    >({
      mutation: RefreshDocument,
      variables: {
        token: refresh_token,
      },
    });

    if (!data || !data.refresh) {
      useExternalLog("ApolloAuthentication", "Refresh token failed, was null.");
    }

    // refresh expires_in is in seconds
    const expiryTime =
      Date.now() + (data?.refresh?.expires_in ?? 0) * 1000 - 1000;
    localStorage.setItem(
      LocalStorageKeys.AUTH_DETAILS,
      JSON.stringify(data?.refresh),
    );
    localStorage.setItem(LocalStorageKeys.AUTH_EXPIRY, expiryTime.toString());

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${data?.refresh?.access_token}`,
      },
    };
  }

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${access_token}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          todaysSleep: {
            keyArgs: false,
            merge(existing: Sleep[] = [], incoming: Sleep[] | Sleep) {
              const normalized = Array.isArray(incoming)
                ? incoming
                : [incoming];

              const updated = [...existing];

              for (const sleep of normalized) {
                const index = updated.findIndex(
                  (existingSleep) => existingSleep.date === sleep.date,
                );

                if (index === -1) {
                  updated.unshift(sleep);
                  continue;
                }

                updated[index] = {
                  ...updated[index],
                  ...sleep,
                };
              }
              return updated;
            },
          },
        },
      },
    },
  }),
});

const unauthenticatedClient = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App = ({ Component, pageProps, router: { pathname } }: AppProps) => {
  const [activeTab, setActiveTab] = useState(
    tabs.findIndex((t) => t.link === pathname),
  );

  useEffect(() => {
    setActiveTab(tabs.findIndex((t) => t.link === pathname));
  }, [pathname]);

  const showNavigation = useMemo(
    () =>
      !["/auth", "/", "/get_token", "/onboard", "/run/prepare"].includes(
        pathname,
      ),
    [pathname],
  );

  useEffect(() => {
    console.log(
      "%cSPRINT",
      "color: rgb(79 70 229); font-size: 4em; -webkit-text-stroke-width: 1.5px; -webkit-text-stroke-color: black;",
    );
  }, []);

  return (
    <ApolloProvider client={client}>
      <ToastContainer position="bottom-left" />
      <Head>
        <title>Welcome to frontend!</title>
      </Head>
      <main className="app flex h-full flex-col">
        <Component {...pageProps} />
      </main>
      {showNavigation && (
        <Navigation
          useController={useNavigationController}
          tabs={tabs}
          activeTab={activeTab}
          changeTab={setActiveTab}
        />
      )}
    </ApolloProvider>
  );
};

export default App;
