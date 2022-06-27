import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { TextInput } from './TextInput'

export default {
    title: 'Components/TextInput',
    component: TextInput,
} as ComponentMeta<typeof TextInput>

const Template: ComponentStory<typeof TextInput> = args => (
    <TextInput {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
    primary: true,
    label: 'TextInput',
}

export const Secondary = Template.bind({})
Secondary.args = {
    label: 'TextInput',
}

export const Large = Template.bind({})
Large.args = {
    size: 'large',
    label: 'TextInput',
}

export const Small = Template.bind({})
Small.args = {
    size: 'small',
    label: 'TextInput',
}
