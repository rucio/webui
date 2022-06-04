import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Header } from './Header'

export default {
    title: 'Components/Header',
    component: Header,
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = args => <Header {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {
    user: {
        name: 'Rucio',
    },
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}
