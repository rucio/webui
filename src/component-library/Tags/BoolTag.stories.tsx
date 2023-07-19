import { StoryFn, Meta } from "@storybook/react";
import { BoolTag as BT } from "./BoolTag";

export default {
    title: 'Components/Tags',
    component: BT
} as Meta<typeof BT>

const Template: StoryFn<typeof BT> = args => <BT {...args}/>

export const BoolTypeTag = Template.bind({})
BoolTypeTag.args = {
    val: true,
}