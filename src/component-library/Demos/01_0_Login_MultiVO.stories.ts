import { Login } from "../Pages/Login/Login";
import { Meta, StoryObj } from "@storybook/react";
import { OIDCProvider, VO } from "@/lib/core/entity/auth-models";


export default {
    title: 'Demos/01_Login',
    component: Login,
} as Meta<typeof Login>

type Story = StoryObj<typeof Login>;

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

const IndigoIAMProvider: OIDCProvider = {
    name: "Indigo IAM",
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
    oidcEnabled: false,
    oidcProviders: [cernOIDCProvider],
}

const voCMS: VO = {
    name: "CMS",
    shortName: "cms",
    logoUrl: "https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",
    oidcEnabled: false,
    oidcProviders: [cernOIDCProvider, IndigoIAMProvider],
}


const voLHCb: VO = {
    name: "LHCb",
    shortName: "lhcb",
    logoUrl: "https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",
    oidcEnabled: false,
    oidcProviders: [cernOIDCProvider],
}

export const ABasicLogin: Story = {
    args: {
        loginViewModel: {
            status: 'success',
            x509Enabled: false,
            oidcEnabled: false,
            oidcProviders: [cernOIDCProvider],
            multiVOEnabled: false,
            voList: [voAtlas, voCMS],
            isLoggedIn: false,
            rucioAuthHost: 'https://rucio.cern.ch',
        },
        authViewModel: {
            status: "success",
            message: "",
            rucioAccount: "",
            rucioMultiAccount: "",
            rucioAuthType: "",
            rucioAuthToken: "",
            rucioIdentity: "",
            rucioAuthTokenExpires: "",
            role: undefined,
        }
    },
}

export const ABasicMultiVOLogin: Story = {
    args: {
        loginViewModel: {
            status: 'success',
            x509Enabled: true,
            oidcEnabled: false,
            oidcProviders: [cernOIDCProvider],
            multiVOEnabled: true,
            voList: [voAtlas, voCMS, voLHCb],
            isLoggedIn: false,
            rucioAuthHost: 'https://rucio.cern.ch',
        },
        authViewModel: {
            status: "success",
            message: "",
            rucioAccount: "",
            rucioMultiAccount: "",
            rucioAuthType: "",
            rucioAuthToken: "",
            rucioIdentity: "",
            rucioAuthTokenExpires: "",
            role: undefined,
        }
    },
}

