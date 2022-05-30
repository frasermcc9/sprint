import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { LocalStorageKeys } from "@sprint/common";
import { Navigation, Tab, useNavigationController } from "@sprint/components";
import {
  LoginMutation,
  RefreshDocument,
  RefreshMutation,
  RefreshMutationVariables,
} from "@sprint/gql";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { useState } from "react";
import { ReactComponent as HomeFilled } from "../../../libs/assets/icons/home-filled.svg";
import { ReactComponent as Home } from "../../../libs/assets/icons/home.svg";
import "./styles.css";

const tabs: Tab[] = [
  {
    label: "Home",
    displayActive: <HomeFilled className="h-12 w-12" />,
    displayInactive: <Home className="h-12 w-12" />,
    link: "/",
  },
  {
    label: "Goals",
    displayActive: <span className="font-bold">Goals</span>,
    displayInactive: <>Goals</>,
    link: "/goals",
  },
  {
    label: "Profile",
    displayActive: <span className="font-bold">Profile</span>,
    displayInactive: <>Profile</>,
    link: "/profile",
  },
  {
    label: "Social",
    displayActive: <span className="font-bold">Social</span>,
    displayInactive: <>Social</>,
    link: "/social",
  },
];

const httpLink = createHttpLink({
  uri: "http://localhost:3333/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}\nPath: ${path}\n`,
        locations,
      );
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const authDetailsStr = localStorage.getItem(LocalStorageKeys.AUTH_DETAILS);

  const { access_token, refresh_token }: LoginMutation["login"] = authDetailsStr
    ? JSON.parse(authDetailsStr)
    : {};

  const expiryTime = localStorage.getItem(LocalStorageKeys.AUTH_EXPIRY);

  console.log(expiryTime);

  if (expiryTime && Date.now() > +expiryTime) {
    const {
      data: { refresh },
    } = await unauthenticatedClient.mutate<
      RefreshMutation,
      RefreshMutationVariables
    >({
      mutation: RefreshDocument,
      variables: {
        token: refresh_token,
      },
    });

    const expiryTime = Date.now() + refresh.expires_in - 1000;
    localStorage.setItem(
      LocalStorageKeys.AUTH_DETAILS,
      JSON.stringify(refresh),
    );
    localStorage.setItem(LocalStorageKeys.AUTH_EXPIRY, expiryTime.toString());

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${refresh.access_token}`,
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
  cache: new InMemoryCache(),
});

const unauthenticatedClient = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App = ({ Component, pageProps }: AppProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Welcome to frontend!</title>
      </Head>
      <main className="app min-h-screen">
        <Component {...pageProps} />
      </main>
      <Navigation
        useController={useNavigationController}
        tabs={tabs}
        activeTab={activeTab}
        changeTab={setActiveTab}
      />
    </ApolloProvider>
  );
};

export default App;
