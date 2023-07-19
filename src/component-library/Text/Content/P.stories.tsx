
import {StoryFn, Meta} from '@storybook/react'

import {P as Para} from './P'

export default {
    title: 'Components/Text/Content',
    component: Para,
} as Meta<typeof Para>

const Template: StoryFn<typeof Para> = args => <Para {...args} />

export const P = Template.bind({})
P.args = {
    children: 'Lorem ipsum etc...',
    mono: false
}