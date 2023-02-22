import {StoryFn, Meta} from '@storybook/react'

import {H1} from './H1'

export default {
    title: 'Components/Text/Headings/H1',
    component: H1,
} as Meta<typeof H1>

const Template: StoryFn<typeof H1> = args => <H1 {...args} />

export const Primary = Template.bind({})
Primary.args = {
    text: 'H1',
}