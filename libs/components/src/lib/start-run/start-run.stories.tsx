import { Story, Meta } from "@storybook/react";
import { StartRun, StartRunProps, useMockStartRunController } from ".";

export default {
  component: StartRun,
  title: "StartRun",
} as Meta;

const Template: Story<StartRunProps> = (args) => <StartRun {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  useController: useMockStartRunController,
};
