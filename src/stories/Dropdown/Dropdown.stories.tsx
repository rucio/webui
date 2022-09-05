import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Dropdown } from './Dropdown'

export default {
    title: 'Components/Dropdown',
    component: Dropdown,
} as ComponentMeta<typeof Dropdown>

const Template: ComponentStory<typeof Dropdown> = args => <Dropdown {...args} />

export const Primary = Template.bind({})
Primary.args = {
    label: 'Dropdown',
    options: ['option 1', 'option 2', 'option 3'],
}
