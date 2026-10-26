import { fireEvent, render, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { FeatureFlagMap } from '@/lib/core/entity/feature-config';
import RucioLayout from '@/app/(rucio)/layout';

// Renders the real (rucio) layout tree (Providers, FeatureProvider, command palette)
// so the provider order is covered: components mounted inside Providers must see the
// feature flags the server resolved.

const features: FeatureFlagMap = {
    rules: true,
    'rules.create': true,
    'rules.approve': true,
    subscriptions: true,
    rses: true,
    accounts: true,
    'accounts.manage': true,
    'accounts.manage.core': true,
    'accounts.manage.identities': true,
    'accounts.manage.attributes': true,
    'accounts.manage.quotas': true,
    'dids.metadata': true,
    'dids.mutate': true,
    'dids.ami_tags': false,
    'dids.panda_task': false,
};

jest.mock('next-auth/react', () => ({
    useSession: () => ({ data: { user: { role: 'admin', rucioAccount: 'root' } }, status: 'authenticated', update: jest.fn() }),
}));
jest.mock('next/navigation', () => ({
    usePathname: () => '/dashboard',
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn() }),
    useSearchParams: () => new URLSearchParams(),
}));
jest.mock('@/lib/infrastructure/auth/session-monitor', () => ({
    SessionMonitorProvider: ({ children }: { children: React.ReactNode }) => children,
}));
// permix/react is ESM-only and does not resolve under jest.
jest.mock('@/lib/infrastructure/permissions', () => ({
    PermissionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@/lib/infrastructure/hooks/usePermissions', () => ({
    usePermissions: () => ({ check: () => true, isReady: true }),
}));
jest.mock('@tanstack/react-query-devtools', () => ({ ReactQueryDevtools: () => null }));
jest.mock('@/component-library/pages/Layout', () => ({
    Layout: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@/lib/infrastructure/auth/nextauth-session-utils', () => ({
    getSession: jest.fn().mockResolvedValue({ user: { rucioAccount: 'root' }, allUsers: [] }),
}));
jest.mock('@/lib/infrastructure/ioc/container-config', () => ({
    __esModule: true,
    default: {
        get: () => ({
            execute: jest.fn().mockResolvedValue(undefined),
            enabledSet: jest.fn().mockResolvedValue(features),
        }),
    },
}));

describe('(rucio) layout provider order', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify({ status: 'success', activeAccount: { rucioAccount: 'root' } }));
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });

    it('shows the account entries in the command palette when accounts is on', async () => {
        const tree = await RucioLayout({ children: <div>page</div> });
        render(tree);

        fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

        expect(await screen.findByText('Accounts')).toBeInTheDocument();
        expect(await screen.findByText('My account')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('Search commands, pages, and more...'), { target: { value: 'root' } });
        expect(await screen.findByText("Open account 'root'")).toBeInTheDocument();
    });
});
