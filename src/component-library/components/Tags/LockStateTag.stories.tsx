import { LockState } from "@/lib/core/entity/rucio";
import { StoryFn, Meta } from "@storybook/react";
import { LockStateTag as L } from "./LockStateTag";

export default {
    title: 'Components/Tags',
    component: L,
} as Meta<typeof L>;

const Template: StoryFn<typeof L> = (args) => <L {...args} />;

export const LockStateTag = Template.bind({});
LockStateTag.args = {
    lockState: LockState.OK,
    tiny: false,
};
