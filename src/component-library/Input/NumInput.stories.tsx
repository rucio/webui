import { StoryFn, Meta } from "@storybook/react";

import { NumInput as NI} from "./NumInput";

export default {
    title: "Components/Input",
    component: NI,
} as Meta<typeof NI>

const Template: StoryFn<typeof NI> = (args) => <NI {...args} />;

export const NumInput = Template.bind({});
NumInput.args = {
    value: 3,
    children: undefined,
    placeholder: "Placeholder String",
    max: 5,
    min: 1,
}