import { render, screen } from '@testing-library/react';
import { FeatureProvider } from '@/component-library/features/feature-flags/FeatureProvider';
import { FeatureFlagMap } from '@/lib/core/entity/feature-config';
import { HeaderClient } from '@/component-library/features/layout/HeaderClient';

jest.mock('next-auth/react', () => ({ useSession: () => ({ data: { user: { role: 'user' } }, update: jest.fn() }) }));
jest.mock('@/lib/infrastructure/hooks/usePermissions', () => ({ usePermissions: () => ({ check: () => false, isReady: true }) }));
jest.mock('@/lib/infrastructure/hooks/useTips', () => ({ useTips: () => ({ openPanel: jest.fn(), dismissedTips: new Set(), allTips: [] }) }));
jest.mock('@/lib/infrastructure/auth/session-monitor', () => ({ useSessionMonitor: () => ({ manualSignOut: jest.fn() }) }));
jest.mock('@/lib/infrastructure/hooks/useCommandPalette', () => ({ useCommandPalette: () => ({ open: jest.fn() }) }));
jest.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light', setTheme: jest.fn() }) }));
jest.mock('next/navigation', () => ({ usePathname: () => '/dashboard' }));

function renderNav(overrides: Partial<FeatureFlagMap>) {
    const map: FeatureFlagMap = {
        rules: true,
        'rules.create': true,
        'rules.approve': true,
        subscriptions: true,
        rses: true,
        'dids.metadata': true,
        'dids.mutate': true,
        ...overrides,
    };
    return render(
        <FeatureProvider features={map}>
            <HeaderClient siteHeader={{} as any} siteHeaderError={undefined} isSiteHeaderFetching={false} />
        </FeatureProvider>,
    );
}

describe('HeaderClient nav gating', () => {
    it('shows RSEs when enabled', () => {
        renderNav({});
        expect(screen.getByText('RSEs')).toBeInTheDocument();
    });

    it('hides RSEs when rses is disabled', () => {
        renderNav({ rses: false });
        expect(screen.queryByText('RSEs')).not.toBeInTheDocument();
    });
});
