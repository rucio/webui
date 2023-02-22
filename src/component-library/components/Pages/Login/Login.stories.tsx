import { StoryFn, Meta } from '@storybook/react'

import { Login } from './Login'

export default {
    title: 'Components/Pages/Login',
    component: Login,
} as Meta<typeof Login>

const Template: StoryFn<typeof Login> = args => <Login {...args} />

export const LoginPage = Template.bind({})
LoginPage.args = {
    loginViewModel: {
        x509Enabled: true,
        oidcEnabled: true,
        oidcProviders: ["OIDC Provider 1", "OIDC Provider 2", "OIDC Provider 3"],
        multiVOEnabled: true,
        voList: ["VO 1", "VO 2", "VO 3"],
        isLoggedIn: false,
    },
    login: () => {}
}
