import {StoryFn, Meta} from '@storybook/react'
import { AccountDropdown as AD } from './AccountDropdown'

export default {
    title: 'Components/Pages/Layout',
    component: AD,
} as Meta<typeof AD>

const Template: StoryFn<typeof AD> = args => <AD {...args} />

export const AccountDropdown = Template.bind({})
AccountDropdown.args = {
    isProfileOpen: true,
    accountActive: "Galahad",
    accountsPossible: ["Galahad", "Percival", "Gawain", "Gareth"],
}