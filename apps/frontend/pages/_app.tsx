import { AppProps } from "next/app";
import Head from "next/head";
import { Navigation, Tab, useNavigationController } from "@sprint/components";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import "./styles.css";

import { ReactComponent as Home } from "../../../libs/assets/icons/home.svg";
import { ReactComponent as HomeFilled } from "../../../libs/assets/icons/home-filled.svg";
import React, { useState } from "react";
import {
  LoginMutation,
  RefreshDocument,
  RefreshMutation,
  RefreshMutationFn,
  RefreshMutationOptions,
  RefreshMutationResult,
  RefreshMutationVariables,
} from "@sprint/gql";

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
  const authDetailsStr = localStorage.getItem("auth_details");

  const { access_token, refresh_token }: LoginMutation["login"] = authDetailsStr
    ? JSON.parse(authDetailsStr)
    : {};

  const expiryTime = localStorage.getItem("auth_expiry");

  if (Date.now() > +expiryTime) {
    const {
      data: {
        data: { refresh },
      },
    } = await client.mutate<RefreshMutationResult, RefreshMutationVariables>({
      mutation: RefreshDocument,
      variables: {
        token: refresh_token,
      },
    });

    const expiryTime = Date.now() + refresh.expires_in - 1000;
    localStorage.setItem("auth_details", JSON.stringify(refresh));
    localStorage.setItem("auth_expiry", expiryTime.toString());

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
