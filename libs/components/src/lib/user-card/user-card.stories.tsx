import { E1 } from "@sprint/assets";
import { Story, Meta } from "@storybook/react";
import { UserCard, UserCardProps } from ".";

export default {
  component: UserCard,
  title: "UserCard",
} as Meta;

const Template: Story<UserCardProps> = (args) => <UserCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  avatarUrl: "https://static0.fitbit.com/images/profile/defaultProfile_100.png",
  emblem: E1,
  firstName: "John",
  lastName: "Doe",
  xp: 5495,
};
