import { Story, Meta } from "@storybook/react";
import { CircularProgress, CircularProgressProps } from ".";

export default {
  component: CircularProgress,
  title: "CircularProgress",
  argTypes: {
    value: {
      control: {
        type: "range",
      },
    },
    mode: {
      control: {
        type: "radio",
        options: ["auto", "manual"],
      },
    },
  },
} as Meta;

const Template: Story<CircularProgressProps<"auto">> = (args) => (
  <div className="max-w-xs">
    <CircularProgress {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  mode: "auto",
  duration: 10,
};
