import { StoryFn, Meta } from '@storybook/react'

import { NumberInput } from './NumberInput'

export default {
    title: 'Components/Input',
    component: NumberInput,
} as Meta<typeof NumberInput>

const Template: StoryFn<typeof NumberInput> = args => <NumberInput {...args} />

export const NumericInput = Template.bind({})
NumericInput.args = {
    disabled: false,
    focusByDefault: false,
    inline: false,
    label: 'NumberInput',
    max: 100,
    min: 0,
    placeholder: 'Placeholder String',
    show: 'standard'
}
