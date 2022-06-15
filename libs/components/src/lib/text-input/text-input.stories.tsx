import { Story, Meta } from "@storybook/react";
import { useState } from "react";
import { TextInput, TextInputProps } from ".";

export default {
  component: TextInput,
  title: "TextInput",
} as Meta;

const Template: Story<TextInputProps> = (args) => {
  const [value, setValue] = useState("");

  return (
    <TextInput
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Primary = Template.bind({});
Primary.args = {};
