import { StoryFn ,Meta } from '@storybook/react'

import { Timeline } from './Timeline'

export default {
    title: 'Components/Timeline',
    component: Timeline,
} as Meta<typeof Timeline>

const Template: StoryFn<typeof Timeline> = args => <Timeline {...args} />

export const Primary = Template.bind({})
Primary.args = {
    steps: [
        "Bro",
        "Go",
        "Home"
    ],
    active: 2,
}
