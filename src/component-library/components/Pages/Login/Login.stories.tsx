import { OIDCProvider, VO } from '@/lib/core/entity/auth-models'
import { StoryFn, Meta } from '@storybook/react'

import { Login } from './Login'

export default {
    title: 'Components/Pages/Login',
    component: Login,
} as Meta<typeof Login>

const Template: StoryFn<typeof Login> = args => <Login {...args} />

const cernOIDCProvider: OIDCProvider = {
    name: "CERN",
    url: "https://login.cern.ch/adfs/oauth2/authorize",
    clientId: "1234567890",
    clientSecret: "1234567890",
    authorizationUrl: "https://login.cern.ch/adfs/oauth2/authorize",
    tokenUrl: "https://login.cern.ch/adfs/oauth2/token",
    refreshTokenUrl: "https://login.cern.ch/adfs/oauth2/token",
    redirectUrl: "https://login.cern.ch/adfs/oauth2/authorize",
}

const googleOIDCProvider: OIDCProvider = {
    name: "Google",
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId: "1234567890",
    clientSecret: "1234567890",
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    redirectUrl: "https://accounts.google.com/o/oauth2/v2/auth",
}

const voAtlas: VO = {
    name: "ATLAS",
    shortName: "atl",
    logoUrl: "https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",
    oidcEnabled: true,
    oidcProviders: [cernOIDCProvider],
}

const voCMS: VO = {
    name: "CMS",
    shortName: "cms",
    logoUrl: "https://cms.cern/wp-content/uploads/2019/07/CMS-Logo-1.png",
    oidcEnabled: true,
    oidcProviders: [cernOIDCProvider, googleOIDCProvider],
}

export const LoginPage = Template.bind({})
LoginPage.args = {
    loginViewModel: {
        status: 'success',
        x509Enabled: true,
        oidcEnabled: true,
        oidcProviders: [cernOIDCProvider],
        multiVOEnabled: true,
        voList: [voAtlas, voCMS],
        isLoggedIn: false,
        rucioAuthHost: 'https://rucio.cern.ch',
    },
    authViewModel: {
        status: 'error',
        message: 'Invalid Login Credentials',
        rucioIdentity: '',
        rucioAccount: '',
        rucioAuthToken: '',
        rucioAuthType: 'userpass',
        rucioAuthTokenExpires: '',

    }
}
