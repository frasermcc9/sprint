import { Story, Meta } from "@storybook/react";
import { useState } from "react";
import { NativeModal, NativeModalProps } from ".";

export default {
  component: NativeModal,
  title: "NativeModal",
} as Meta;

const Template: Story<NativeModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(true);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button>
      </div>
      <NativeModal {...args} closeModal={closeModal} isOpen={isOpen} />
    </>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  action: () => {
    alert("Action");
  },
  actionText: "Begin",

  text: "Are you sure you want to start a new run?",
  title: "Confirmation",
};
