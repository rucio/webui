import { StoryFn, Meta } from '@storybook/react'

import { StepsLispan } from './StepsLispan'

export default {
    title: 'Components/Steps/StepsLispan',
    component: StepsLispan,
} as Meta<typeof StepsLispan>

const TemplateStepsLispan: StoryFn<typeof StepsLispan> = args => <StepsLispan {...args} />

export const TextInput = TemplateStepsLispan.bind({})
TextInput.args = {
    blue: false,
    body: 'Process Step',
}