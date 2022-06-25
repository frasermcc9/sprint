import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { xpDetails } from "@sprint/common";
import { useCurrentUserQuery } from "@sprint/gql";
import classNames from "classnames";
import React, { Fragment } from "react";
import XpIcon from "./xp-icon";

export interface XpPopupProps {
  useController: typeof useXpPopupController;
}

export const XpPopup: React.FC<XpPopupProps> = ({ useController }) => {
  const { xp } = useController();
  const { level, xpThroughLevel, xpRequiredForLevel } = xpDetails(xp);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              { "text-opacity-90": open },
              "flex items-center",
            )}
          >
            <XpIcon xp={xp} />
            <ChevronDownIcon
              className={`${open ? "" : "text-opacity-70"}
            ml-2 h-5 w-5 text-gray-700 transition duration-150 ease-in-out group-hover:text-opacity-80`}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-50 mt-1.5 transform px-2 md:max-w-xs">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <div className="bg-white p-4">
                  <div className="flex items-center gap-x-2">
                    <XpIcon xp={xp} size="md" />
                    <div className="flex w-32 flex-col">
                      <div className="text-lg font-bold">{xp} XP</div>
                      <div className="text-sm font-semibold">
                        {xpThroughLevel}/{xpRequiredForLevel} XP until level{" "}
                        {level + 1}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export const useXpPopupController = () => {
  const { data, loading } = useCurrentUserQuery();

  return { xp: data?.currentUser?.xp ?? 0, loading };
};

export const useMockXpPopupController: typeof useXpPopupController = () => {
  return { xp: 500, loading: false };
};

export default XpPopup;
