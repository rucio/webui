import { StoryFn, Meta } from '@storybook/react'

import { Input } from './Input'

export default {
    title: 'Components/Input',
    component: Input,
} as Meta<typeof Input>

const TemplateText: StoryFn<typeof Input> = args => <Input {...args} />

export const TextInput = TemplateText.bind({})
TextInput.args = {
    disabled: false,
    focusByDefault: false,
    inline: false,
    label: 'TextInput',
    password: false,
    placeholder: 'Placeholder String',
    show: 'standard'
}

// export const NumericInput = TemplateNumber.bind({})
// NumericInput.args = {
//     disabled: false,
//     focusByDefault: false,
//     inline: false,
//     label: 'TextInput',
//     max: 100,
//     min: 0,
//     password: false,
//     placeholder: 'Placeholder String',
//     show: 'standard'
// }
