import { Story, Meta } from "@storybook/react";
import {
  SignInButton,
  SignInButtonProps,
  useMockSignInButtonController,
} from ".";

export default {
  component: SignInButton,
  title: "SignInButton",
} as Meta;

const Template: Story<SignInButtonProps> = (args) => <SignInButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  useController: useMockSignInButtonController,
};
