import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Checkbox } from './Checkbox'

export default {
    title: 'Components/Button',
    component: Checkbox,
} as ComponentMeta<typeof Checkbox>

const Template: ComponentStory<typeof Checkbox> = args => <Checkbox {...args} />

export const CheckBox = Template.bind({})
CheckBox.args = {
    label: 'example',
    kind: 'success',
    isChecked: true,
    style: 'rounded_checkbox',
}

export const RadioButton = Template.bind({})
RadioButton.args = {
    label: 'example',
    kind: 'info',
    style: 'background-color',
    isChecked: true,
    type: 'radio',
}
