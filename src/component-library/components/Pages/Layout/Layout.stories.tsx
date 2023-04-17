import {StoryFn, Meta} from '@storybook/react'
import { Layout as L} from './Layout'

export default {
    title: 'Components/Pages/Layout',
    component: L,
} as Meta<typeof L>

const Template: StoryFn<typeof L> = args => <L {...args} />

export const Layout = Template.bind({})
Layout.args = {
    child: <div className="bg-red-500">Layout</div>,
}