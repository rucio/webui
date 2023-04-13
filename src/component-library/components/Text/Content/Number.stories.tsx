
import {StoryFn, Meta} from '@storybook/react'

import {Number as L} from './Number'

export default {
    title: 'Components/Text/Content',
    component: L,
} as Meta<typeof L>

const Template: StoryFn<typeof L> = args => <L {...args} />

export const Number = Template.bind({})
Number.args = {
    number: 2000,
    decimalPlaces: 2,
}