import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Button } from './Button'

export default {
    title: 'Components/Button',
    component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = args => <Button {...args} />

export const Standard = Template.bind({})
Standard.args = {
    kind: 'primary',
    size: 'medium',
    label: 'Button',
}
