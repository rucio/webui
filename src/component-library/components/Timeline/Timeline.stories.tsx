import { StoryFn ,Meta } from '@storybook/react'

import { Timeline as T} from './Timeline'

export default {
    title: 'Components/Timeline',
    component: T
} as Meta<typeof T>

const Template: StoryFn<typeof T> = args => <T {...args} />

export const Timeline = Template.bind({})
Timeline.args = {
    steps: [
        "Bro",
        "Go",
        "Home"
    ],
    active: 2,
    onJump: (goal: number) => {console.log(goal)}
}
