import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { Role, User } from '@/lib/core/entity/auth-models';

const meta: Meta<typeof Header> = {
    title: 'Components/Header',
    component: Header,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof Header>;

const getMockUser = (accountName: string): User => ({
    rucioIdentity: 'mock-identity',
    rucioAccount: accountName,
    rucioVO: 'mock-vo',
    role: Role.USER,
    country: 'Switzerland',
});

export const SingleAccount: Story = {
    args: {
        siteHeader: {
            status: 'success',
            activeAccount: getMockUser('mock-account'),
            availableAccounts: [getMockUser('mock-account')],
            homeUrl: 'https://rucio.cern.ch',
            projectUrl: 'https://home.cern',
        },
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

export const MultipleAccounts: Story = {
    args: {
        siteHeader: {
            status: 'success',
            activeAccount: getMockUser('mock-account'),
            availableAccounts: [getMockUser('mock-account'), getMockUser('mock-account-2'), getMockUser('mock-account-3')],
            homeUrl: 'https://rucio.cern.ch',
            projectUrl: 'https://home.cern',
        },
        siteHeaderError: null,
        isSiteHeaderFetching: false,
    },
};

export const Loading: Story = {
    args: {
        siteHeader: undefined,
        siteHeaderError: null,
        isSiteHeaderFetching: true,
    },
};

export const Failed: Story = {
    args: {
        siteHeader: undefined,
        siteHeaderError: new Error('Failed to fetch header data'),
        isSiteHeaderFetching: false,
    },
};
