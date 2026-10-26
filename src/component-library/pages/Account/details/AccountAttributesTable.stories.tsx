import type { Meta, StoryObj } from '@storybook/nextjs';
import { AccountAttributesTable } from './AccountAttributesTable';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof AccountAttributesTable> = {
    title: 'Components/Pages/Account/Details/AccountAttributesTable',
    component: AccountAttributesTable,
    decorators: [
        Story => (
            <>
                <div className="h-96">
                    <Story />
                </div>
                <Toaster />
            </>
        ),
    ],
};
export default meta;
type Story = StoryObj<typeof AccountAttributesTable>;

const attributes = [
    { key: 'admin', value: true },
    { key: 'country-ch', value: 'user' },
    { key: 'country-de', value: 'admin' },
    { key: 'sign-gcs', value: false },
    { key: 'group', value: 'phys-higgs' },
];

export const Admin: Story = { args: { attributes, canManage: true } };
export const ReadOnly: Story = { args: { attributes, canManage: false } };
