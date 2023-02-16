import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Alert } from './Alert'

export default {
    title: 'Components/Alert',
    component: Alert,
    argTypes: {
        background: { control: 'color' },
    },
} as ComponentMeta<typeof Alert>

const Template: ComponentStory<typeof Alert> = args => <Alert {...args} />

export const Standard = Template.bind({})
Standard.args = {}
