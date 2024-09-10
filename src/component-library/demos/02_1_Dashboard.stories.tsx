import { Role } from '@/lib/core/entity/account';
import { Meta, StoryObj } from '@storybook/react';
import { fixtureOngoingrules, fixtureUsedquota } from 'test/fixtures/widget-fixtures';
import { Dashboard as D } from '@/component-library/pages/legacy/Dashboard/Dashboard';

export default {
    title: 'Demos/02_Dashboard',
    component: D,
} as Meta<typeof D>;

type Story = StoryObj<typeof D>;

export const SampleUserDashboard: Story = {
    args: {
        accountname: 'mayank',
        accountrole: Role.USER,
        inputOngoingrules: Array.from({ length: 20 }, (v, k) => fixtureOngoingrules()),
        inputUsedquota: Array.from({ length: 20 }, (v, k) => fixtureUsedquota()),
    },
};
