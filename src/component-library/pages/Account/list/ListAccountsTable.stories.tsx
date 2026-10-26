import type { Meta, StoryObj } from '@storybook/nextjs';
import { GridReadyEvent } from 'ag-grid-community';
import { ListAccountsTable } from './ListAccountsTable';
import { AccountListItemViewModel } from '@/lib/infrastructure/data/view-model/account';
import { AccountType } from '@/lib/core/entity/rucio';
import { StreamingErrorType, StreamingStatus, UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const rows: AccountListItemViewModel[] = [
    { status: 'success', account: 'jdoe', accountType: AccountType.USER, email: 'jdoe@example.com' },
    { status: 'success', account: 'atlas-phys', accountType: AccountType.GROUP, email: null },
    { status: 'success', account: 'transfer-bot', accountType: AccountType.SERVICE, email: 'ops@example.com' },
    { status: 'success', account: 'root', accountType: AccountType.USER, email: null },
];

const hook = (overrides: Partial<UseStreamReader<AccountListItemViewModel>> = {}): UseStreamReader<AccountListItemViewModel> => ({
    status: StreamingStatus.STOPPED,
    error: undefined,
    start: () => {},
    stop: () => {},
    ...overrides,
});

const fill = (data: AccountListItemViewModel[]) => (event: GridReadyEvent) => event.api.setGridOption('rowData', data);

const meta: Meta<typeof ListAccountsTable> = {
    title: 'Components/Pages/Account/List/ListAccountsTable',
    component: ListAccountsTable,
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
type Story = StoryObj<typeof ListAccountsTable>;

export const Default: Story = { args: { streamingHook: hook(), onGridReady: fill(rows) } };
export const Empty: Story = { args: { streamingHook: hook(), onGridReady: fill([]) } };
export const StreamError: Story = {
    args: {
        streamingHook: hook({ error: { type: StreamingErrorType.NETWORK_ERROR, message: 'Could not reach the Rucio server.' } }),
        onGridReady: fill([]),
    },
};
