import { Meta, StoryFn } from "@storybook/react";
import { RequestTypeTag as R } from "./RequestTypeTag";
import { RequestType } from "@/lib/core/entity/rucio";

export default {
    title: 'Components/Tags',
    component: R,
} as Meta<typeof R>;

const Template: StoryFn<typeof R> = (args) => <R {...args} />;

export const RequestTypeTag = Template.bind({});
RequestTypeTag.args = {
    requesttype: RequestType.TRANSFER
}