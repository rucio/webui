import { StoryFn, Meta } from '@storybook/react'

import { Login } from './Login'

export default {
    title: 'Components/Pages/Login',
    component: Login,
} as Meta<typeof Login>

const Template: StoryFn<typeof Login> = args => <Login {...args} />

export const LoginPage = Template.bind({})
LoginPage.args = {
}
