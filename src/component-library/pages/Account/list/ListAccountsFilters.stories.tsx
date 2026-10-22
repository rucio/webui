import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { ListAccountsFilters, AccountFilters, EMPTY_FILTERS } from './ListAccountsFilters';

const Wrapper = ({ initial = EMPTY_FILTERS, isRunning = false }: { initial?: AccountFilters; isRunning?: boolean }) => {
    const [filters, setFilters] = useState(initial);
    return <ListAccountsFilters filters={filters} onChange={setFilters} onSearch={() => {}} onStop={() => {}} isRunning={isRunning} />;
};

const meta: Meta<typeof Wrapper> = {
    title: 'Components/Pages/Account/List/ListAccountsFilters',
    component: Wrapper,
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Wrapper>;

export const Empty: Story = {};
export const Prefilled: Story = { args: { initial: { account: 'j*', type: 'GROUP', identity: 'CN=jdoe' } } };
export const InvalidName: Story = { args: { initial: { ...EMPTY_FILTERS, account: 'Bad Name!' } } };
export const Running: Story = { args: { isRunning: true } };
