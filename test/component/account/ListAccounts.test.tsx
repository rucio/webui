import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StreamingErrorType, StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { ListAccounts, streamUrl, pageQuery } from '@/component-library/pages/Account/list/ListAccounts';

const replace = jest.fn();
const push = jest.fn();
let params = new URLSearchParams();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ replace, push }),
    usePathname: () => '/accounts',
    useSearchParams: () => params,
}));

const toast = jest.fn();
jest.mock('@/lib/infrastructure/hooks/useToast', () => ({ useToast: () => ({ toast, dismiss: jest.fn() }) }));

let canCreate = true;
let manage = true;
jest.mock('@/lib/infrastructure/hooks/usePermissions', () => ({ usePermissions: () => ({ check: () => canCreate, isReady: true }) }));
jest.mock('@/component-library/features/feature-flags/FeatureProvider', () => ({ useFeature: () => manage }));

const startStreaming = jest.fn();
const gridApi = { flushAsyncTransactions: jest.fn(), getDisplayedRowCount: jest.fn(() => 0) };
let hook: any;
jest.mock('@/lib/infrastructure/hooks/useTableStreaming', () => ({
    __esModule: true,
    default: () => ({ onGridReady: jest.fn(), streamingHook: hook, startStreaming, stopStreaming: jest.fn(), gridApi }),
}));
jest.mock('@/component-library/pages/Account/list/ListAccountsTable', () => ({
    ListAccountsTable: () => <div data-testid="table" />,
    accountHref: (n: string) => `/account/${encodeURIComponent(n)}`,
}));

const renderPage = () =>
    render(
        <QueryClientProvider client={new QueryClient()}>
            <ListAccounts />
        </QueryClientProvider>,
    );

beforeEach(() => {
    jest.clearAllMocks();
    params = new URLSearchParams();
    canCreate = true;
    manage = true;
    hook = { status: StreamingStatus.STOPPED, error: undefined, start: jest.fn(), stop: jest.fn() };
    gridApi.getDisplayedRowCount.mockReturnValue(0);
});

describe('url helpers', () => {
    it('omit empty filters and map type to accountType', () => {
        expect(streamUrl({ account: '', type: 'ALL', identity: '' })).toBe('/api/feature/list-accounts');
        expect(streamUrl({ account: 'j*', type: 'GROUP', identity: '' })).toBe('/api/feature/list-accounts?account=j*&accountType=GROUP');
        expect(pageQuery({ account: 'j*', type: 'GROUP', identity: '' })).toBe('account=j*&type=GROUP');
    });
});

describe('ListAccounts', () => {
    it('pre-fills the filters from the URL and streams with those params', () => {
        params = new URLSearchParams('account=j*&type=GROUP');
        renderPage();
        expect(screen.getByLabelText('Name')).toHaveValue('j*');
        expect(startStreaming).toHaveBeenCalledWith('/api/feature/list-accounts?account=j*&accountType=GROUP');
        expect(replace).not.toHaveBeenCalled();
    });

    it('mirrors a new search in the URL with replace', () => {
        renderPage();
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'ab' } });
        fireEvent.click(screen.getByRole('button', { name: 'Search' }));
        expect(replace).toHaveBeenCalledWith('/accounts?account=ab');
        expect(startStreaming).toHaveBeenLastCalledWith('/api/feature/list-accounts?account=ab');
    });

    it('offers "Open <name> directly" only for an exact name with zero rows after the stream finished', () => {
        params = new URLSearchParams('account=suspended-user');
        hook = { ...hook, status: StreamingStatus.RUNNING };
        const { rerender } = renderPage();
        expect(screen.queryByText(/Open suspended-user directly/)).not.toBeInTheDocument();
        hook = { ...hook, status: StreamingStatus.STOPPED };
        rerender(
            <QueryClientProvider client={new QueryClient()}>
                <ListAccounts />
            </QueryClientProvider>,
        );
        expect(screen.getByRole('link', { name: 'Open suspended-user directly' })).toHaveAttribute('href', '/account/suspended-user');
    });

    it('does not offer it for a wildcard name or when rows exist', () => {
        params = new URLSearchParams('account=j*');
        hook = { ...hook, status: StreamingStatus.RUNNING };
        const { rerender } = renderPage();
        hook = { ...hook, status: StreamingStatus.STOPPED };
        rerender(
            <QueryClientProvider client={new QueryClient()}>
                <ListAccounts />
            </QueryClientProvider>,
        );
        expect(screen.queryByText(/directly/)).not.toBeInTheDocument();
    });

    it('shows a warning with Retry when the stream fails', () => {
        hook = { ...hook, error: { type: StreamingErrorType.NETWORK_ERROR, message: 'Boom' } };
        renderPage();
        expect(screen.getByText('Boom')).toBeInTheDocument();
        startStreaming.mockClear();
        fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
        expect(startStreaming).toHaveBeenCalledTimes(1);
    });

    it('hides Create account without permission or without accounts.manage', () => {
        canCreate = false;
        const { unmount } = renderPage();
        expect(screen.queryByRole('button', { name: 'Create account' })).not.toBeInTheDocument();
        unmount();
        canCreate = true;
        manage = false;
        renderPage();
        expect(screen.queryByRole('button', { name: 'Create account' })).not.toBeInTheDocument();
    });

    it('creates an account and navigates to its identities tab', async () => {
        (global.fetch as any) = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'success', account: 'newacc' }) });
        renderPage();
        fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
        fireEvent.change(screen.getByLabelText(/Name/, { selector: '#create-account-name' }), { target: { value: 'newacc' } });
        fireEvent.click(screen.getAllByRole('button', { name: 'Create account' }).pop()!);
        await waitFor(() => expect(push).toHaveBeenCalledWith('/account/newacc?tab=identities'));
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'success' }));
        expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe('/api/feature/create-account');
    });

    it('keeps the dialog open and shows the server message on failure', async () => {
        (global.fetch as any) = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ status: 'error', message: 'Name taken' }) });
        renderPage();
        fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
        fireEvent.change(screen.getByLabelText(/Name/, { selector: '#create-account-name' }), { target: { value: 'dup' } });
        fireEvent.click(screen.getAllByRole('button', { name: 'Create account' }).pop()!);
        expect(await screen.findByText('Name taken')).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
    });
});
