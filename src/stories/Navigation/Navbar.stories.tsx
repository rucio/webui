import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Navbar } from './Navbar'

export default {
    title: 'Components/Alert',
    component: Navbar,
    argTypes: {
        background: { control: 'color' },
    },
} as ComponentMeta<typeof Navbar>

const Template: ComponentStory<typeof Navbar> = args => <Navbar {...args} />

export const Standard = Template.bind({})
Standard.args = {}
