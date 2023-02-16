import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Box } from './Box'
import { BoxBody } from './components/BoxBody'
import { BoxFooter } from './components/BoxFooter'

export default {
    title: 'Components/Box',
    component: Box,
    subcomponents: { BoxBody: BoxBody, BoxFooter: BoxFooter },
} as ComponentMeta<typeof Box>

const Template: ComponentStory<typeof Box> = args => (
    <Box {...args}>
        <BoxBody />
        <BoxFooter />
    </Box>
)

export const Primary = Template.bind({})
