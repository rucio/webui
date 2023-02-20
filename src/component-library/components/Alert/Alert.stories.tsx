import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Alert } from './Alert'

export default {
    title: 'Components/Alert',
    component: Alert,
} as ComponentMeta<typeof Alert>

const Template: ComponentStory<typeof Alert> = args => <Alert {...args} />

export const Standard= Template.bind({})
Standard.args = {
    message: "Standard banner message",
    variant: "primary",
}

export const Warning = Template.bind({})
Warning.args = {
    message: "Warning banner message",
    variant: "warn",
}
export const Success = Template.bind({})
Success.args = {
    message: "Success banner message",
    variant: "success",
}
export const Error = Template.bind({})
Error.args = {
    message: "Error banner message",
    variant: "error",
}
