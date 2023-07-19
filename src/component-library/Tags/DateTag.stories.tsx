import { StoryFn, Meta } from "@storybook/react";
import { DateTag as DT } from "./DateTag";

export default {
    title: 'Components/Tags',
    component: DT
} as Meta<typeof DT>

const Template: StoryFn<typeof DT> = args => <DT {...args}/>

export const DateTypeTag = Template.bind({})
DateTypeTag.args = {
    date: new Date(2022, 1),
    dateFormat: undefined,
}