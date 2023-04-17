import { StoryFn, Meta } from "@storybook/react";

import { ListInput as LI} from "./ListInput";

export default {
    title: "Components/Input",
    component: LI,
} as Meta<typeof LI>;

const Template: StoryFn<typeof LI> = (args) => <LI {...args} />;
export const ListInput = Template.bind({});
ListInput.args = {
    onAdd: (value: string) => {},
    onRemove: (value: string) => {},
    placeholder: "Placeholder",
    value: [],
};