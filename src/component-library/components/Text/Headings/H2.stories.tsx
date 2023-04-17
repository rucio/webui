import {StoryFn, Meta} from '@storybook/react'

import {H2} from './H2'

export default {
    title: 'Components/Text/Headings/H2',
    component: H2,
} as Meta<typeof H2>

const Template: StoryFn<typeof H2> = args => <H2 {...args} />

export const Primary = Template.bind({})
Primary.args = {
    children: 'H2',
}