import { AppProps } from "next/app";
import Head from "next/head";
import { Navigation, Tab, useNavigationController } from "@sprint/components";
import "./styles.css";

import { ReactComponent as Home } from "../../../libs/assets/icons/home.svg";
import { ReactComponent as HomeFilled } from "../../../libs/assets/icons/home-filled.svg";
import { useState } from "react";

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

const App = ({ Component, pageProps }: AppProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
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
    </>
  );
};

export default App;
