import {StoryFn, Meta} from '@storybook/react'
import { Layout as L} from './Layout'
import { LayoutViewModel } from './Layout'

export default {
    title: 'Components/Pages/Layout',
    component: L,
} as Meta<typeof L>

const Template: StoryFn<typeof L> = args => <L {...args} />

export const Layout = Template.bind({})
Layout.args = {
    children: <div className="bg-red-500">Layout</div>,
    LVM: {
        accountActive: "Galahad",
        accountsPossible: ["Galahad", "Percival", "Gawain", "Gareth"],
        rucioProjectLink: "rucio.cern.ch",
        experimentProjectLink: "atlas.cern",
    } as LayoutViewModel
}