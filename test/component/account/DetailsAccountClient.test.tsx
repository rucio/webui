import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DetailsAccountClient } from '@/app/(rucio)/account/[name]/DetailsAccountClient';
import { AccountInfoViewModel } from '@/lib/infrastructure/data/view-model/account';
import { AccountStatus, AccountType } from '@/lib/core/entity/rucio';
import { IdentityType } from '@/lib/core/entity/account';

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

    it('invalidates the whole account scope after a suspend', async () => {
        const { client } = renderClient();
        const invalidate = jest.spyOn(client, 'invalidateQueries');
        fireEvent.click(within(screen.getByRole('toolbar')).getByRole('button', { name: /Suspend/ }));
        fireEvent.click(await screen.findByRole('button', { name: 'Suspend account' }));

        await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe'] }));
        const [, init] = calls('update-account')[0];
        expect(JSON.parse((init as RequestInit).body as string)).toEqual({ account: 'jdoe', options: { status: 'SUSPENDED' } });
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'success' }));
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

    it('shows no mutation actions to a non-admin', async () => {
        isAdmin = false;
        renderClient({ sessionAccount: 'jdoe' });
        expect(within(screen.getByRole('toolbar')).queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
    });
});
