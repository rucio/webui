import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Input } from './Input'

export default {
    title: 'Components/Input',
    component: Input,
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = args => <Input {...args} />

export const TextInput = Template.bind({})
TextInput.args = {
    size: 'medium',
    kind: 'primary',
    label: 'TextInput',
}

export const NumberInput = Template.bind({})
NumberInput.args = {
    type: 'number',
    show: 'rounded',
    kind: 'primary',
    label: 'NumberInput',
    min: 0,
    max: 5,
}
