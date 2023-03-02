import { StoryFn, Meta } from '@storybook/react'

import { Alert } from './Alert'

export default {
    title: 'Components/Alert',
    component: Alert,
} as Meta<typeof Alert>

const Template: StoryFn<typeof Alert> = args => <Alert {...args} />

export const Primary = Template.bind({})
Primary.args = {
    message: "Standard banner message",
    variant: "primary",
}