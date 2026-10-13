import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccountIdentitiesTable } from '@/component-library/pages/Account/details/AccountIdentitiesTable';
import { AccountAttributesTable } from '@/component-library/pages/Account/details/AccountAttributesTable';
import { AccountQuotasTable } from '@/component-library/pages/Account/details/AccountQuotasTable';
import { IdentityType } from '@/lib/core/entity/account';

// AG Grid does not render in jsdom, so capture the column definitions the tables pass to RegularTable.
type Col = { colId?: string; cellRenderer?: (params: { data: unknown }) => React.ReactNode };
let columns: Col[] = [];
jest.mock('@/component-library/features/table/RegularTable/RegularTable', () => ({
    RegularTable: (props: { columnDefs: Col[] }) => {
        columns = props.columnDefs;
        return null;
    },
}));

const actions = () => columns.find(c => c.colId === 'actions');
const renderActions = (data: unknown) => render(<>{actions()!.cellRenderer!({ data })}</>);

const identity = { identity: 'jdoe', type: IdentityType.USERPASS, email: 'jdoe@example.com' };
const attribute = { key: 'country-ch', value: 'user' };
const quota = { rse: 'CERN-DISK', bytesLimit: 1e12, bytesUsed: 1e11, files: 3, bytesRemaining: 9e11 };

const tables = [
    [
        'identities',
        (canManage: boolean, busy = false) => <AccountIdentitiesTable identities={[identity]} canManage={canManage} busy={busy} />,
        identity,
        ['Delete'],
    ],
    [
        'attributes',
        (canManage: boolean, busy = false) => <AccountAttributesTable attributes={[attribute]} canManage={canManage} busy={busy} />,
        attribute,
        ['Delete'],
    ],
    [
        'quotas',
        (canManage: boolean, busy = false) => <AccountQuotasTable locality="local" quotas={[quota]} canManage={canManage} busy={busy} />,
        { ...quota, rseExpression: quota.rse },
        ['Edit', 'Remove'],
    ],
] as const;

describe.each(tables)('%s table row actions', (_name, table, row, labels) => {
    beforeEach(() => {
        columns = [];
    });

    it('has no actions column when canManage is false', () => {
        render(table(false));
        expect(columns.length).toBeGreaterThan(0);
        expect(actions()).toBeUndefined();
    });

    it('renders enabled actions for admins', () => {
        render(table(true));
        renderActions(row);
        for (const label of labels) expect(screen.getByRole('button', { name: label })).toBeEnabled();
    });

    it('disables the actions while a mutation is pending', () => {
        render(table(true, true));
        renderActions(row);
        for (const label of labels) expect(screen.getByRole('button', { name: label })).toBeDisabled();
    });
});

describe('quota row actions', () => {
    it('are absent on rows without a quota', () => {
        render(<AccountQuotasTable locality="local" quotas={[{ ...quota, bytesLimit: null, bytesRemaining: null }]} canManage />);
        const { container } = renderActions({ ...quota, rseExpression: quota.rse, bytesLimit: null });
        expect(container).toBeEmptyDOMElement();
    });
});
