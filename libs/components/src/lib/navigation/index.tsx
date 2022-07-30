import { MockController } from "@sprint/common";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

export interface Tab {
  displayInactive: any;
  displayActive: any;
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

  const size = "40px";

  return (
    <div className="fixed bottom-0 z-50 w-full border-t-2 border-slate-300 bg-gray-50 py-2 shadow-lg">
      <div className="mt-1 flex items-center justify-around">
        {tabs.map((tab, index) => (
          <div key={index} className="flex w-1/4 items-center justify-center">
            <button
              onClick={() => {
                changeTab(index);
                navTo(tab.link);
              }}
              className="h-auto w-auto bg-transparent sm:ml-0"
            >
              {activeTab === index ? (
                <Image
                  width={size}
                  height={size}
                  src={tab.displayActive}
                  alt=""
                />
              ) : (
                <Image
                  width={size}
                  height={size}
                  src={tab.displayInactive}
                  alt=""
                />
              )}
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
