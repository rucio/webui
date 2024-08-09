import { OIDCProvider, VO } from "@/lib/core/entity/auth-models";
import { Meta, StoryObj } from "@storybook/react";
import { Login } from "../Pages/Login/Login";

export default {
    title: 'Demos/01_Login',
    component: Login,
} as Meta<typeof Login>


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
    oidcEnabled: true,
    oidcProviders: [cernOIDCProvider],
}

const voCMS: VO = {
    name: "CMS",
    shortName: "cms",
    logoUrl: "https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",
    oidcEnabled: true,
    oidcProviders: [cernOIDCProvider, IndigoIAMProvider],
}


const voLHCb: VO = {
    name: "LHCb",
    shortName: "lhcb",
    logoUrl: "https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png",
    oidcEnabled: true,
    oidcProviders: [cernOIDCProvider],
}

type Story = StoryObj<typeof Login>;

export const AMultiVOOIDCEnabledLogin: Story = {
    args: {
        loginViewModel: {
            status: 'success',
            x509Enabled: true,
            oidcEnabled: true,
            oidcProviders: [cernOIDCProvider],
            multiVOEnabled: true,
            voList: [voAtlas, voCMS, voLHCb],
            isLoggedIn: false,
            accountActive: undefined,
            accountsAvailable: undefined,
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
    play: async ({ container }) => {
        voAtlas.oidcEnabled = true;
        voCMS.oidcEnabled = true;
        voLHCb.oidcEnabled = true;
    }
} 
