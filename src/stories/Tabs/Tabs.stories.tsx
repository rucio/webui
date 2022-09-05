import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Tabs } from './Tabs'

export default {
    title: 'Components/Tabs',
    component: Tabs,
} as ComponentMeta<typeof Tabs>

const Template: ComponentStory<typeof Tabs> = args => <Tabs {...args} />

export const Primary = Template.bind({})
Primary.args = {
    tabs: ['DID', 'RSE', 'Options', 'Summary'],
    active: 1,
}
