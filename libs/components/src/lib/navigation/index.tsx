import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { MockController } from "@sprint/common";
import Link from "next/link";

export interface Tab {
  displayInactive: React.ReactNode;
  displayActive: React.ReactNode;
  label: string;
  link: string;
}

interface NavigationProps {
  useController: typeof useNavigationController;
  tabs: Tab[];
  activeTab: number;
  changeTab: (index: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  useController,
  tabs,
  activeTab,
  changeTab,
}) => {
  const { navTo } = useController();

  return (
    <div className="fixed bottom-0 h-16 w-full border-t-2 border-slate-300 bg-gray-50 shadow-lg">
      <div className="mt-1 flex items-center justify-around">
        {tabs.map((tab, index) => (
          <div key={index} className="flex w-1/4 items-center justify-center">
            {/* <Link prefetch href={tab.link}></Link> */}
            <button
              onClick={() => {
                changeTab(index);
                navTo(tab.link);
              }}
              className="h-auto w-auto bg-transparent sm:ml-0"
            >
              {activeTab === index ? tab.displayActive : tab.displayInactive}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const useNavigationController = () => {
  const router = useRouter();

  const goTo = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router],
  );

  return { navTo: goTo };
};

export const useMockNavigationController: MockController<
  typeof useNavigationController
> = () => {
  return {
    navTo: (url: string) => null,
  };
};

export default Navigation;
