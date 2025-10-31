import { Login } from '@/component-library/pages/legacy/Login/Login';
import { within, userEvent } from '@storybook/testing-library';
import { Meta, StoryObj } from '@storybook/nextjs';
import { sleep } from '../utils';
import { OIDCProvider, VO } from '@/lib/core/entity/auth-models';

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
    oidcProviders: [cernOIDCProvider, googleOIDCProvider],
};
export const Playbook_InitLogin: Story = {
    args: {
        loginViewModel: {
            status: 'success',
            userpassEnabled: true,
            x509Enabled: true,
            oidcEnabled: true,
            oidcProviders: [cernOIDCProvider],
            multiVOEnabled: true,
            voList: [voAtlas, voCMS],
            isLoggedIn: false,
            accountsAvailable: undefined,
            accountActive: undefined,
            rucioAuthHost: 'https://rucio.cern.ch',
        },
        authViewModel: {
            status: 'success',
            message: '',
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

        const userpassButton = canvas.getByRole('button', { name: /Userpass/ });
        await userEvent.click(userpassButton);

        const usernameTextbox = canvas.getByRole('textbox', { name: /Username/ });
        await userEvent.type(usernameTextbox, 'mayank', { delay: 100 });

        const passwordTextbox = canvas.getByLabelText(/Password/);
        await userEvent.type(passwordTextbox, 'password', { delay: 100 });

        const loginButton = canvas.getByRole('button', { name: /Login/ });
        await userEvent.click(loginButton);
        await sleep(2000);
    },
};
