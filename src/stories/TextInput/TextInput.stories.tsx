import { ComponentStory, ComponentMeta } from '@storybook/react'

import { TextInput } from './TextInput'

export default {
    title: 'Components/TextInput',
    component: TextInput,
} as ComponentMeta<typeof TextInput>

const Template: ComponentStory<typeof TextInput> = args => (
    <TextInput {...args} />
)

export const Standard = Template.bind({})
Standard.args = {
    size: 'normal',
    kind: 'primary',
    label: 'TextInput',
}
