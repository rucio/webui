import {StoryFn, Meta} from '@storybook/react'

import {H2 as H2Component} from './H2'

export default {
    title: 'Components/Text/Headings',
    component: H2Component,
} as Meta<typeof H2Component>

const Template: StoryFn<typeof H2Component> = args => <H2Component {...args} />

export const H2 = Template.bind({})
H2.args = {
    children: 'H2',
}