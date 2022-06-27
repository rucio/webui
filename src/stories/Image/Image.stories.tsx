import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'
import { Image } from './Image'

export default {
    title: 'Components/Image',
    component: Image,
    parameters: {
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof Image>

const Template: ComponentStory<typeof Image> = args => <Image {...args} />

export const Primary = Template.bind({})
