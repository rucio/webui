import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Separator } from './Separator'

export default {
    title: 'Components/Separator',
    component: Separator,
} as ComponentMeta<typeof Separator>

const Template: ComponentStory<typeof Separator> = () => <Separator />

export const Primary = Template.bind({})
