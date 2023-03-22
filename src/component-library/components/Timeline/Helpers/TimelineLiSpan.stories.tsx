import { StoryFn, Meta} from "@storybook/react";
import { TimelineLiSpan as TL } from "./TimelineLiSpan";

export default {
    title: "Components/Timeline/TimelineLiSpan",
    component: TL
} as Meta<typeof TL>

const Template: StoryFn<typeof TL> = args => <TL {...args}/>

export const TimelineLiSpan = Template.bind({})
TimelineLiSpan.args = {
    children: "1",
    highlight: false,
    completed: false,
}