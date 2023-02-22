import { StoryFn, Meta} from '@storybook/react'

import { Box } from './Box'

export default {
    title: 'Components/Box',
    component: Box,
} as Meta<typeof Box>

const Template: StoryFn<typeof Box> = args => <Box {...args}/>

export const Condensed = Template.bind({})
Condensed.args = {
    title: "Condensed Box Title",
    body: "Body",
    footer: "Box footer",
    type: "condensed",
}
export const Spacious = Template.bind({})
Spacious.args = {
    title: "Spacious Box Title",
    body: "Body",
    footer: "Box footer",
    type: "spacious",
}
export const Blue= Template.bind({})
Blue.args = {
    title: "Blue Box Title",
    body: "Body",
    footer: "Box footer",
    type: "blue",
}
export const Danger= Template.bind({})
Danger.args = {
    title: "Danger Box Title",
    body: "Body",
    footer: "Box footer",
    type: "danger",
}

