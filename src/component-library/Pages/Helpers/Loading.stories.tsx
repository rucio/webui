import { StoryFn, Meta } from "@storybook/react";
import { Loading as L } from "./Loading";

export default {
    title: 'Components/Pages/Helpers',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <L {...args} />;

export const Loading = Template.bind({});
Loading.args = {
    title: "Loading",
};
