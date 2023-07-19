import { StoryFn, Meta } from '@storybook/react'
import { CredentialInput } from './CredentialInput'

export default {
    title: 'Components/Pages/Login/CredentialInput',
    component: CredentialInput,
} as Meta<typeof CredentialInput>

const Template: StoryFn<typeof CredentialInput> = args => <CredentialInput {...args} />

export const CredentialInputComponent = Template.bind({})
CredentialInputComponent.args = {
    submitHandler: () => {},
    children: "Credential Input",
}