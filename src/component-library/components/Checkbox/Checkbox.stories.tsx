import { Meta, StoryFn } from '@storybook/react'
import { Checkbox } from './Checkbox'

export default {
    title: 'Components/Button',
    component: Checkbox,
} as Meta<typeof Checkbox>

const Template: StoryFn<typeof Checkbox> = args => <Checkbox {...args} />

export const CheckBox = Template.bind({})
CheckBox.args = {
    label: 'example',
    isChecked: true,
    disabled: false,
    type: 'checkbox'
}

export const RadioButton = Template.bind({})
RadioButton.args = {
    label: 'example',
    isChecked: true,
    disabled: false,
    type: 'radio',
}
