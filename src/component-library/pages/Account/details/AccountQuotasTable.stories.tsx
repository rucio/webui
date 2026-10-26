import type { Meta, StoryObj } from '@storybook/nextjs';
import { AccountQuotasTable } from './AccountQuotasTable';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof AccountQuotasTable> = {
    title: 'Components/Pages/Account/Details/AccountQuotasTable',
    component: AccountQuotasTable,
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
type Story = StoryObj<typeof AccountQuotasTable>;

export const Local: Story = {
    args: {
        locality: 'local',
        canManage: true,
        quotas: [
            { rse: 'CERN-PROD_DATADISK', bytesLimit: 10e12, bytesUsed: 4.2e12, files: 1520, bytesRemaining: 5.8e12 },
            { rse: 'BNL-OSG2_DATADISK', bytesLimit: -1, bytesUsed: 2.1e12, files: 800, bytesRemaining: null },
            { rse: 'DESY-HH_SCRATCHDISK', bytesLimit: null, bytesUsed: 3e11, files: 42, bytesRemaining: null },
            { rse: 'TOKYO-LCG2_DATADISK', bytesLimit: 1e12, bytesUsed: 9.5e11, files: 120, bytesRemaining: 5e10 },
            { rse: 'IN2P3-CC_DATADISK', bytesLimit: 1e12, bytesUsed: 1.2e12, files: 300, bytesRemaining: -2e11 },
        ],
    },
};

export const Global: Story = {
    args: {
        locality: 'global',
        canManage: true,
        quotas: [
            {
                rseExpression: 'tier=1&type=DATADISK',
                resolvedRses: ['BNL-OSG2_DATADISK', 'IN2P3-CC_DATADISK', 'TOKYO-LCG2_DATADISK'],
                bytesLimit: 50e12,
                bytesUsed: 4.25e12,
                files: 1220,
                bytesRemaining: 45.75e12,
            },
            {
                rseExpression: 'country=ch',
                resolvedRses: ['CERN-PROD_DATADISK'],
                bytesLimit: -1,
                bytesUsed: 4.2e12,
                files: 1520,
                bytesRemaining: null,
            },
        ],
    },
};

export const ReadOnly: Story = { args: { ...Local.args, canManage: false } };
