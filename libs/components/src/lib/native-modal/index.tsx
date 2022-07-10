import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback } from "react";

export interface NativeModalProps {
  isOpen: boolean;
  closeModal: () => void;
  text: string;
  title: string;
  action?: () => void;
  actionText?: string;
}

export const NativeModal: React.FC<NativeModalProps> = ({
  isOpen,
  closeModal,
  action,
  actionText,
  text,
  title,
}) => {
  const actionWrapper = useCallback(() => {
    action?.();
    closeModal();
  }, [action, closeModal]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[18rem] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="p-6">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-center text-sm text-gray-500">{text}</p>
                  </div>
                </div>

                <div className="flex w-full border-t border-gray-300">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-l-md px-4 py-2 text-lg font-normal text-indigo-600 focus:outline-none active:bg-gray-200"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  {action && (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-r-md border-l border-gray-300 px-4 py-2 text-lg font-bold text-indigo-600 focus:outline-none active:bg-gray-200"
                      onClick={actionWrapper}
                    >
                      {actionText}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NativeModal;
