import { ComponentStory, ComponentMeta } from '@storybook/react'
import {ToggleSwitch} from "./ToggleSwitch";

export default {
    title: 'Components/Button',
    component: ToggleSwitch,
} as ComponentMeta<typeof ToggleSwitch>

const Template:ComponentStory<typeof ToggleSwitch> = args => <ToggleSwitch {...args} />

export const Switch = Template.bind({})
Switch.args = {
    label:"example",
    checked:true
}