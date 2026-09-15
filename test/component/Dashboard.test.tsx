/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/component-library/pages/Dashboard/Dashboard';

jest.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light' }) }));

// The dashboard's widgets stream data of their own; this test only covers the page heading.
jest.mock('@/component-library/pages/Dashboard/widgets/TopRulesWidget', () => ({ TopRulesWidget: () => null }));
jest.mock('@/component-library/pages/Dashboard/widgets/TopStorageUsageWidget', () => ({ TopStorageUsageWidget: () => null }));
jest.mock('@/component-library/pages/Dashboard/widgets/HotBarWidget', () => ({ HotBarWidget: () => null }));
jest.mock('@/app/(rucio)/queries', () => ({ getSiteHeader: jest.fn().mockResolvedValue({}) }));
jest.mock('@/lib/infrastructure/hooks/useStreamReader', () => ({
    __esModule: true,
    default: () => ({ status: 'stopped', error: undefined, start: jest.fn(), stop: jest.fn() }),
    StreamingStatus: { STOPPED: 'stopped', RUNNING: 'running' },
}));

class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(global as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver = ResizeObserverStub;

const renderDashboard = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <Dashboard />
        </QueryClientProvider>,
    );
};

describe('Dashboard', () => {
    it('leaves the page heading to the server-rendered page so it is not duplicated', () => {
        renderDashboard();
        expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    });
});
