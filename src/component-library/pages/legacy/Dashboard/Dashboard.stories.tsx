import { Role } from '@/lib/core/entity/account';
import { StoryFn, Meta } from '@storybook/react';
import { fixtureOngoingrules, fixtureUsedquota } from '@/test/fixtures/widget-fixtures';
import { Dashboard as D } from './Dashboard';

export default {
    title: 'Components/Pages/Dashboard',
    component: D,
} as Meta<typeof D>;

const Template: StoryFn<typeof D> = args => <D {...args} />;

export const Dashboard = Template.bind({});
Dashboard.args = {
    accountname: 'test',
    accountrole: Role.ADMIN,
    inputOngoingrules: Array.from({ length: 20 }, (v, k) => fixtureOngoingrules()),
    inputUsedquota: Array.from({ length: 20 }, (v, k) => fixtureUsedquota()),
};
