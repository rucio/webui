import { StoryFn, Meta} from '@storybook/react'

import { Box } from './Box'

export default {
    title: 'Components/Box',
    component: Box,
} as Meta<typeof Box>

const Template: StoryFn<typeof Box> = args => <Box {...args}/>

export const Primary = Template.bind({})
Primary.args = {
    title: "Condensed Box Title",
    body: "Body",
    footer: "Box footer",
    type: "condensed",
}