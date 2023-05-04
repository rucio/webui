import {StoryFn, Meta} from '@storybook/react'

import {AvailabilityTag as A} from './AvailabilityTag'

export default {
    title: 'Components/Tags',
    component: A,
} as Meta<typeof A>

const Template: StoryFn<typeof A> = args => <A {...args} />

export const AvailabilityTag= Template.bind({})
AvailabilityTag.args = {
    availability: "Available"
}