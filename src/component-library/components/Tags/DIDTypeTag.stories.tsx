import {StoryFn, Meta} from '@storybook/react'

import {DIDTypeTag as L} from './DIDTypeTag'

export default {
    title: 'Components/Tags',
    component: L,
} as Meta<typeof L>

const Template: StoryFn<typeof L> = args => <L {...args} />

export const DIDTypeTag= Template.bind({})
DIDTypeTag.args = {
    didtype: 'Container',
}