import { RequestState } from "@/lib/core/entity/rucio";
import { Meta, StoryFn } from "@storybook/react";
import { RequestStateTag as R } from "./RequestStateTag";

export default {
    title: 'Components/Tags',
    component: R,
} as Meta<typeof R>;

const Template: StoryFn<typeof R> = (args) => <R {...args} />;

export const RequestStateTag = Template.bind({});
RequestStateTag.args = {
    state: RequestState.FAILED
}