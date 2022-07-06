import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'
import { Page } from './Page'

export default {
    title: 'Components/Page',
    component: Page,
    parameters: {
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof Page>

const Template: ComponentStory<typeof Page> = args => <Page {...args} />

export const Login = Template.bind({})

Login.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const loginButton = await canvas.getByRole('button', { name: /Log in/i })
    await userEvent.click(loginButton)
}
