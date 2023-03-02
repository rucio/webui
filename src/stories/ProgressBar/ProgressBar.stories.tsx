import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ProgressBar } from './ProgressBar'

export default {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    argTypes: {
        background: { control: 'color' },
    },
} as ComponentMeta<typeof ProgressBar>

const Template: ComponentStory<typeof ProgressBar> = args => (
    <ProgressBar {...args} />
)

export const Standard = Template.bind({})
Standard.args = {}
