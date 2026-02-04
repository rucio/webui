import { OIDCProvider, VO } from '@/lib/core/entity/auth-models';
import { Meta, StoryObj } from '@storybook/nextjs';
import { within, userEvent } from 'storybook/test';
import { Login } from '@/component-library/pages/Login/Login';
import { sleep } from '../utils';

export default {
    title: 'Demos/01_Login',
    component: Login,
} as Meta<typeof Login>;

type Story = StoryObj<typeof Login>;

const cernOIDCProvider: OIDCProvider = {
    name: 'CERN',
    url: 'https://login.cern.ch/adfs/oauth2/authorize',
    clientId: '1234567890',
    clientSecret: '1234567890',
    authorizationUrl: 'https://login.cern.ch/adfs/oauth2/authorize',
    tokenUrl: 'https://login.cern.ch/adfs/oauth2/token',
    refreshTokenUrl: 'https://login.cern.ch/adfs/oauth2/token',
    redirectUrl: 'https://login.cern.ch/adfs/oauth2/authorize',
};

const googleOIDCProvider: OIDCProvider = {
    name: 'Google',
    url: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: '1234567890',
    clientSecret: '1234567890',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
};

const voAtlas: VO = {
    name: 'ATLAS',
    shortName: 'atl',
    logoUrl: 'https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png',
    oidcEnabled: true,
    oidcProviders: [cernOIDCProvider],
};

const voCMS: VO = {
    name: 'CMS',
    shortName: 'cms',
    logoUrl: 'https://atlas.cern/wp-content/uploads/2019/07/ATLAS-Logo-1.png',
    oidcEnabled: true,
    oidcProviders: [cernOIDCProvider],
};
export const Playbook_Multi_Account: Story = {
    args: {
        loginViewModel: {
            status: 'success',
            userpassEnabled: true,
            x509Enabled: true,
            oidcEnabled: true,
            oidcProviders: [cernOIDCProvider],
            multiVOEnabled: true,
            voList: [voAtlas, voCMS],
            accountsAvailable: undefined,
            accountActive: undefined,
            isLoggedIn: false,
            rucioAuthHost: 'https://rucio.cern.ch',
        },
        authViewModel: {
            status: 'multiple_accounts',
            message: 'mayank,ddmadmin,tester',
            rucioAccount: '',
            rucioMultiAccount: '',
            rucioAuthType: '',
            rucioAuthToken: '',
            rucioIdentity: '',
            rucioAuthTokenExpires: '',
            role: undefined,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const select = canvas.getByRole('button', { name: /undefined/ });
        await sleep(2000);
        await userEvent.click(select);
    },
};
