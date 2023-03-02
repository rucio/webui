import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Steps } from './Steps'

export default {
    title: 'Components/Steps',
    component: Steps,
} as ComponentMeta<typeof Steps>

const Template: ComponentStory<typeof Steps> = args => <Steps {...args} />

export const Primary = Template.bind({})
Primary.args = {
    steps: [
        ['Step', 'This is the first step of the process'],
        ['Step', 'This is the second step of the process'],
        ['Step', 'This is the third step of the process'],
        ['Step', 'This is the fourth step of the process'],
    ],
    active: 2,
}
