import {StoryFn, Meta} from '@storybook/react'

import {H3} from './H3'

export default {
    title: 'Components/Text/Headings/H3',
    component: H3,
} as Meta<typeof H3>

const Template: StoryFn<typeof H3> = args => <H3 {...args} />

export const Primary = Template.bind({})
Primary.args = {
    children: 'H3',
}