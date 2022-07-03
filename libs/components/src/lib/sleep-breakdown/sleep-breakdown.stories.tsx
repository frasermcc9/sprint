import { Story, Meta } from "@storybook/react";
import { SleepBreakdown, SleepBreakdownProps } from ".";

export default {
  component: SleepBreakdown,
  title: "SleepBreakdown",
} as Meta;

const Template: Story<SleepBreakdownProps> = (args) => (
  <div className="max-w-sm">
    <SleepBreakdown {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  sleepDuration: 860,
  times: {
    awake: { value: "17%", color: "bg-red-400", name: "Awake" },
    light: { value: "40%", color: "bg-pink-600", name: "Light" },
    rem: { value: "18%", color: "bg-indigo-400", name: "REM" },
    deep: { value: "25%", color: "bg-violet-700", name: "Deep" },
  },
};
