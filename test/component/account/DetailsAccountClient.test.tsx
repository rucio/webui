import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DetailsAccountClient } from '@/app/(rucio)/account/[name]/DetailsAccountClient';
import { AccountInfoViewModel } from '@/lib/infrastructure/data/view-model/account';
import { AccountStatus, AccountType } from '@/lib/core/entity/rucio';
import { IdentityType } from '@/lib/core/entity/account';
import { pick } from './radix-select';

// AG Grid does not render in jsdom: render the actions column of each row instead.
type ActionColumn = { colId?: string; cellRenderer?: (params: { data: unknown }) => React.ReactNode };
jest.mock('@/component-library/features/table/RegularTable/RegularTable', () => ({
    RegularTable: (props: { columnDefs: ActionColumn[]; rowData: unknown[] }) => {
        const actions = props.columnDefs.find(c => c.colId === 'actions');
        return <>{actions?.cellRenderer && props.rowData.map((data, i) => <div key={i}>{actions.cellRenderer!({ data })}</div>)}</>;
    },
}));

const replace = jest.fn();
const push = jest.fn();
let params = new URLSearchParams();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ replace, push }),
    usePathname: () => '/account/jdoe',
    useSearchParams: () => params,
}));

const updateSession = jest.fn();
jest.mock('next-auth/react', () => ({
    __esModule: true,
    useSession: () => ({ data: { user: { rucioAccount: 'root', rucioIdentity: 'root' } }, status: 'authenticated', update: updateSession }),
}));

const toast = jest.fn();
jest.mock('@/lib/infrastructure/hooks/useToast', () => ({ useToast: () => ({ toast, dismiss: jest.fn() }) }));

let isAdmin = true;
jest.mock('@/lib/infrastructure/hooks/usePermissions', () => ({ usePermissions: () => ({ check: () => isAdmin, isReady: true }) }));
jest.mock('@/component-library/features/feature-flags/FeatureProvider', () => ({ useFeature: () => true }));

const info = (status: AccountStatus = AccountStatus.ACTIVE): AccountInfoViewModel => ({
    status: 'success',
    account: 'jdoe',
    accountType: AccountType.USER,
    accountStatus: status,
    email: 'jdoe@example.com',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-04-01T10:00:00Z',
});

type Reply = { status?: number; body: unknown };
let routes: Record<string, Reply>;

const json = (reply: Reply) => ({
    ok: (reply.status ?? 200) < 400,
    status: reply.status ?? 200,
    statusText: '',
    json: async () => reply.body,
});

const fetchMock = jest.fn(async (url: string) => {
    const path = url.split('?')[0].replace('/api/feature/', '');
    const reply = routes[path];
    if (!reply) throw new Error(`unexpected fetch ${url}`);
    return json(reply);
});

const calls = (path: string) => fetchMock.mock.calls.filter(([url]) => (url as string).startsWith(`/api/feature/${path}`));

const newClient = () => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

const renderClient = (props: Partial<React.ComponentProps<typeof DetailsAccountClient>> = {}, client = newClient()) => {
    const utils = render(
        <QueryClientProvider client={client}>
            <DetailsAccountClient account="jdoe" sessionAccount="root" initialInfo={info()} initialInfoUpdatedAt={Date.now()} {...props} />
        </QueryClientProvider>,
    );
    return { ...utils, client };
};

beforeEach(() => {
    jest.clearAllMocks();
    params = new URLSearchParams();
    isAdmin = true;
    routes = {
        'get-account-info': { body: info() },
        'list-account-identities': {
            body: { status: 'success', identities: [{ identity: 'jdoe', type: IdentityType.USERPASS, email: 'jdoe@example.com' }] },
        },
        'list-account-attributes': { body: { status: 'success', attributes: [{ key: 'country-ch', value: 'user' }] } },
        'get-account-quotas': { body: { status: 'success', local: [], global: [] } },
        'update-account': { body: { status: 'success' } },
        'update-account-attribute': { body: { status: 'success' } },
        'delete-account': { body: { status: 'success' } },
    };
    (global as unknown as { fetch: unknown }).fetch = fetchMock;
});

describe('DetailsAccountClient', () => {
    it('fetches quotas only once the quotas tab is opened', async () => {
        renderClient();
        await waitFor(() => expect(calls('list-account-identities')).toHaveLength(1));
        expect(calls('list-account-attributes')).toHaveLength(1);
        expect(calls('get-account-quotas')).toHaveLength(0);
        expect(calls('get-account-info')).toHaveLength(0); // fresh server data, no client waterfall

        fireEvent.click(screen.getByRole('tab', { name: 'Quotas and usage' }));
        await waitFor(() => expect(calls('get-account-quotas')).toHaveLength(1));
        expect(replace).toHaveBeenCalledWith('/account/jdoe?tab=quotas');

        // going back to another tab keeps the query enabled and cached
        fireEvent.click(screen.getByRole('tab', { name: /Overview/ }));
        fireEvent.click(screen.getByRole('tab', { name: 'Quotas and usage' }));
        expect(calls('get-account-quotas')).toHaveLength(1);
    });

    it('fetches quotas immediately for ?tab=quotas', async () => {
        params = new URLSearchParams('tab=quotas');
        renderClient();
        await waitFor(() => expect(calls('get-account-quotas')).toHaveLength(1));
        expect(screen.getByRole('tab', { name: 'Quotas and usage' })).toHaveAttribute('aria-selected', 'true');
    });

    it('selects the tab from ?tab=identities', async () => {
        params = new URLSearchParams('tab=identities');
        renderClient();
        expect(screen.getByRole('tab', { name: /Identities/ })).toHaveAttribute('aria-selected', 'true');
        fireEvent.click(screen.getByRole('tab', { name: /Overview/ }));
        expect(replace).toHaveBeenCalledWith('/account/jdoe');
    });

    it('issues no identity, attribute or quota requests for a suspended account', async () => {
        params = new URLSearchParams('tab=quotas');
        renderClient({ initialInfo: info(AccountStatus.SUSPENDED) });
        expect(await screen.findByText(/This account is suspended/)).toBeInTheDocument();
        await new Promise(r => setTimeout(r, 20));
        expect(fetchMock).not.toHaveBeenCalled();
        expect(screen.getAllByRole('tab').map(t => t.textContent)).toEqual(['Overview']);
    });

    it('renders the not-found state for a 404 without retrying', async () => {
        routes['get-account-info'] = { status: 404, body: { status: 'error', errorType: 'not_found', message: 'Account jdoe not found' } };
        renderClient({ initialInfo: undefined, initialInfoUpdatedAt: undefined });
        expect(await screen.findByText(/was not found/)).toBeInTheDocument();
        await new Promise(r => setTimeout(r, 20));
        expect(calls('get-account-info')).toHaveLength(1);
        expect(calls('list-account-identities')).toHaveLength(0);
    });

    it('removes the account queries before navigating away after a delete', async () => {
        const { client } = renderClient();
        const remove = jest.spyOn(client, 'removeQueries');
        fireEvent.click(within(screen.getByRole('toolbar')).getByRole('button', { name: /Delete/ }));
        fireEvent.change(await screen.findByLabelText(/Type jdoe to confirm/), { target: { value: 'jdoe' } });
        fireEvent.click(screen.getByRole('button', { name: 'Delete account' }));

        await waitFor(() => expect(push).toHaveBeenCalledWith('/accounts'));
        expect(remove).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe'] });
        expect(remove.mock.invocationCallOrder[0]).toBeLessThan(push.mock.invocationCallOrder[0]);
        const [, init] = calls('delete-account')[0];
        expect(init).toMatchObject({ method: 'DELETE', body: JSON.stringify({ account: 'jdoe' }) });
    });

    it('fetches nothing for the deleted account after a delete', async () => {
        renderClient();
        await waitFor(() => expect(calls('list-account-identities')).toHaveLength(1));
        expect(calls('list-account-attributes')).toHaveLength(1);
        fireEvent.click(within(screen.getByRole('toolbar')).getByRole('button', { name: /Delete/ }));
        fireEvent.change(await screen.findByLabelText(/Type jdoe to confirm/), { target: { value: 'jdoe' } });
        fireEvent.click(screen.getByRole('button', { name: 'Delete account' }));

        await waitFor(() => expect(push).toHaveBeenCalledWith('/accounts'));
        await new Promise(r => setTimeout(r, 50));
        expect(calls('list-account-identities')).toHaveLength(1);
        expect(calls('list-account-attributes')).toHaveLength(1);
        expect(calls('get-account-quotas')).toHaveLength(0);
        expect(calls('get-account-info')).toHaveLength(0);
    });

    it('fetches no identities, attributes or quotas after a suspend', async () => {
        params = new URLSearchParams('tab=quotas');
        const { client } = renderClient();
        await waitFor(() => expect(calls('get-account-quotas')).toHaveLength(1));
        await waitFor(() => expect(calls('list-account-identities')).toHaveLength(1));
        expect(calls('list-account-attributes')).toHaveLength(1);
        const remove = jest.spyOn(client, 'removeQueries');
        const invalidate = jest.spyOn(client, 'invalidateQueries');

        routes['get-account-info'] = { body: info(AccountStatus.SUSPENDED) };
        fireEvent.click(within(screen.getByRole('toolbar')).getByRole('button', { name: /Suspend/ }));
        fireEvent.click(await screen.findByRole('button', { name: 'Suspend account' }));

        expect(await screen.findByText(/This account is suspended/)).toBeInTheDocument();
        await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'success', title: 'Account suspended' })));
        await new Promise(r => setTimeout(r, 50));
        // Rucio answers 404 for the sub-resources of a suspended account: none may be refetched.
        expect(calls('list-account-identities')).toHaveLength(1);
        expect(calls('list-account-attributes')).toHaveLength(1);
        expect(calls('get-account-quotas')).toHaveLength(1);
        expect(calls('get-account-info')).toHaveLength(1);
        expect(invalidate).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe', 'info'] });
        expect(invalidate).not.toHaveBeenCalledWith({ queryKey: ['account', 'jdoe'] });
        expect(remove).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe', 'identities'] });
        expect(remove).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe', 'attributes'] });
        expect(remove).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe', 'quotas'] });
        const [, init] = calls('update-account')[0];
        expect(JSON.parse((init as RequestInit).body as string)).toEqual({ account: 'jdoe', options: { status: 'SUSPENDED' } });

        // Reactivating loads the removed sub-resources again.
        routes['get-account-info'] = { body: info() };
        fireEvent.click(within(screen.getByRole('toolbar')).getByRole('button', { name: /Reactivate/ }));
        fireEvent.click(await screen.findByRole('button', { name: 'Reactivate account' }));
        await waitFor(() => expect(calls('list-account-identities')).toHaveLength(2));
        await waitFor(() => expect(calls('list-account-attributes')).toHaveLength(2));
    });

    it('loads the identities and attributes again after a reactivate', async () => {
        const { client } = renderClient({ initialInfo: info(AccountStatus.SUSPENDED) });
        expect(await screen.findByText(/This account is suspended/)).toBeInTheDocument();
        const invalidate = jest.spyOn(client, 'invalidateQueries');

        fireEvent.click(within(screen.getByRole('toolbar')).getByRole('button', { name: /Reactivate/ }));
        fireEvent.click(await screen.findByRole('button', { name: 'Reactivate account' }));

        await waitFor(() => expect(calls('list-account-identities')).toHaveLength(1));
        await waitFor(() => expect(calls('list-account-attributes')).toHaveLength(1));
        expect(invalidate).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe'] });
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'success', title: 'Account reactivated' }));
    });

    it('keeps the dialog open with the server message and refreshes the session on permission_denied', async () => {
        routes['update-account'] = {
            status: 401,
            body: { status: 'error', errorType: 'permission_denied', message: 'You are not allowed to do this.' },
        };
        renderClient();
        fireEvent.click(within(screen.getByRole('toolbar')).getByRole('button', { name: /Suspend/ }));
        fireEvent.click(await screen.findByRole('button', { name: 'Suspend account' }));

        expect(await screen.findByText('You are not allowed to do this.')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(updateSession).toHaveBeenCalled();
    });

    it('clears the previous error when the request is resubmitted', async () => {
        routes['update-account'] = { status: 500, body: { status: 'error', errorType: 'unknown', message: 'Rucio failed.' } };
        renderClient();
        fireEvent.click(within(screen.getByRole('toolbar')).getByRole('button', { name: /Suspend/ }));
        fireEvent.click(await screen.findByRole('button', { name: 'Suspend account' }));
        expect(await screen.findByText('Rucio failed.')).toBeInTheDocument();

        fetchMock.mockImplementationOnce(() => new Promise(() => {})); // the retry stays pending
        fireEvent.click(screen.getByRole('button', { name: 'Suspend account' }));
        await waitFor(() => expect(screen.queryByText('Rucio failed.')).not.toBeInTheDocument());
    });

    describe('adding a USERPASS identity', () => {
        const PASSWORD = 'fake-secret-pass';
        const hasPassword = (client: QueryClient) =>
            client
                .getMutationCache()
                .getAll()
                .some(m => JSON.stringify(m.state.variables ?? null).includes(PASSWORD));

        const fillUserpass = async () => {
            fireEvent.click(await screen.findByRole('button', { name: /Add identity/ }));
            await pick(/^Type/, 'Username and password');
            fireEvent.change(screen.getByLabelText(/^Identity/), { target: { value: 'newuser' } });
            fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'new@example.org' } });
            fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: PASSWORD } });
            fireEvent.change(screen.getByLabelText(/Confirm password/), { target: { value: PASSWORD } });
            fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Add identity' }));
        };

        beforeEach(() => {
            params = new URLSearchParams('tab=identities');
        });

        it('drops the password from the mutation and the form when the dialog is closed after an error', async () => {
            routes['add-account-identity'] = { status: 409, body: { status: 'error', errorType: 'conflict', message: 'Identity exists.' } };
            const { client } = renderClient();
            await fillUserpass();
            expect(await screen.findByText('Identity exists.')).toBeInTheDocument();
            expect(hasPassword(client)).toBe(true);

            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
            await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
            await waitFor(() => expect(hasPassword(client)).toBe(false));

            fireEvent.click(screen.getByRole('button', { name: /Add identity/ }));
            await pick(/^Type/, 'Username and password');
            expect(screen.getByLabelText(/^Password/)).toHaveValue('');
            expect(screen.getByLabelText(/Confirm password/)).toHaveValue('');
        });

        it('drops the password from the mutation after a successful add', async () => {
            routes['add-account-identity'] = { body: { status: 'success' } };
            const { client } = renderClient();
            await fillUserpass();
            await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Identity added' })));
            await waitFor(() => expect(hasPassword(client)).toBe(false));
            const [, init] = calls('add-account-identity')[0];
            expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({ account: 'jdoe', authType: 'USERPASS', password: PASSWORD });
        });
    });

    it('explains an empty RSE select when the RSE list cannot be loaded', async () => {
        params = new URLSearchParams('tab=quotas');
        routes['list-rses'] = { status: 500, body: {} };
        renderClient();
        fireEvent.click(await screen.findByRole('button', { name: /Set quota/ }));
        expect(await screen.findByText(/Could not load the RSE list/)).toBeInTheDocument();
    });

    it('shows a loading hint while the RSE list loads', async () => {
        params = new URLSearchParams('tab=quotas');
        routes['list-rses'] = { body: {} };
        renderClient();
        await waitFor(() => expect(calls('get-account-quotas')).toHaveLength(1));
        fetchMock.mockImplementationOnce(() => new Promise(() => {})); // list-rses stays pending
        fireEvent.click(await screen.findByRole('button', { name: /Set quota/ }));
        expect(await screen.findByText('Loading RSEs...')).toBeInTheDocument();
    });

    describe('editing an attribute', () => {
        const openEdit = async () => {
            params = new URLSearchParams('tab=attributes');
            renderClient();
            await waitFor(() => expect(calls('list-account-attributes')).toHaveLength(1));
            // the toolbar has an account level Edit too
            const rowEdit = await waitFor(() => {
                const found = screen.getAllByRole('button', { name: 'Edit' }).filter(b => !screen.getByRole('toolbar').contains(b));
                expect(found).toHaveLength(1);
                return found[0];
            });
            fireEvent.click(rowEdit);
            return within(await screen.findByRole('dialog'));
        };

        it('shows the delete and create warning and the locked key, prefilled with the current value', async () => {
            const dialog = await openEdit();
            expect(dialog.getByText(/Saving deletes the attribute and creates it again/)).toBeInTheDocument();
            expect(dialog.getByLabelText('Key')).toHaveValue('country-ch');
            expect(dialog.getByLabelText('Key')).toBeDisabled();
            expect(dialog.getByLabelText(/^Value/)).toHaveValue('user');
            expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled();
        });

        it('sends PUT update-account-attribute, then toasts and refetches the attributes', async () => {
            const dialog = await openEdit();
            fireEvent.change(dialog.getByLabelText(/^Value/), { target: { value: 'group' } });
            fireEvent.click(dialog.getByRole('button', { name: 'Save' }));
            await waitFor(() => expect(calls('update-account-attribute')).toHaveLength(1));
            const [, init] = calls('update-account-attribute')[0] as unknown as [string, RequestInit];
            expect(init.method).toBe('PUT');
            expect(JSON.parse(init.body as string)).toEqual({ account: 'jdoe', key: 'country-ch', value: 'group' });
            await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Attribute updated' })));
            await waitFor(() => expect(calls('list-account-attributes')).toHaveLength(2));
        });

        it('keeps the dialog open with the server message when the update fails', async () => {
            routes['update-account-attribute'] = {
                status: 500,
                body: {
                    status: 'error',
                    errorType: 'unknown',
                    message: 'The new value could not be saved. The previous value was restored.',
                },
            };
            const dialog = await openEdit();
            fireEvent.change(dialog.getByLabelText(/^Value/), { target: { value: 'group' } });
            fireEvent.click(dialog.getByRole('button', { name: 'Save' }));
            expect(await screen.findByText('The new value could not be saved. The previous value was restored.')).toBeInTheDocument();
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('has no Edit button for a non-admin', async () => {
            isAdmin = false;
            params = new URLSearchParams('tab=attributes');
            renderClient({ sessionAccount: 'jdoe' });
            await waitFor(() => expect(calls('list-account-attributes')).toHaveLength(1));
            expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
        });
    });

    it('shows no mutation actions to a non-admin', async () => {
        isAdmin = false;
        renderClient({ sessionAccount: 'jdoe' });
        expect(within(screen.getByRole('toolbar')).queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
    });
});
