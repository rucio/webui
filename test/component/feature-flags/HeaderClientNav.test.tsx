import { render, screen } from '@testing-library/react';
import { FeatureProvider } from '@/component-library/features/feature-flags/FeatureProvider';
import { FeatureFlagMap } from '@/lib/core/entity/feature-config';
import { HeaderClient } from '@/component-library/features/layout/HeaderClient';

// Controllable approval-queue permission (drives canViewApprovalQueue in HeaderClient).
let canViewApprovalQueue = false;

jest.mock('next-auth/react', () => ({ useSession: () => ({ data: { user: { role: 'user' } }, update: jest.fn() }) }));
jest.mock('@/lib/infrastructure/hooks/usePermissions', () => ({
    usePermissions: () => ({ check: () => canViewApprovalQueue, isReady: true }),
}));
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

// The desktop and mobile nav bars can both render items into the DOM, so assert on
// count rather than a single element to stay robust to duplicated labels.
const count = (label: string) => screen.queryAllByText(label).length;

describe('HeaderClient nav gating', () => {
    beforeEach(() => {
        canViewApprovalQueue = false;
    });

    it('shows RSEs when enabled', () => {
        renderNav({});
        expect(screen.getByText('RSEs')).toBeInTheDocument();
    });

    it('hides RSEs when rses is disabled', () => {
        renderNav({ rses: false });
        expect(count('RSEs')).toBe(0);
    });

    it('hides Subscriptions when subscriptions is disabled', () => {
        renderNav({ subscriptions: false });
        expect(count('Subscriptions')).toBe(0);
    });

    it('hides the entire Rules menu when rules and all its children are disabled', () => {
        renderNav({ rules: false, 'rules.create': false, 'rules.approve': false });
        expect(count('Rules')).toBe(0);
        expect(count('List Rules')).toBe(0);
        expect(count('Create a rule')).toBe(0);
    });

    it('keeps the Rules menu but hides Create a rule when only rules.create is disabled', () => {
        renderNav({ 'rules.create': false });
        expect(count('Rules')).toBeGreaterThan(0);
        expect(count('List Rules')).toBeGreaterThan(0);
        expect(count('Create a rule')).toBe(0);
    });

    it('shows Approve Rules only when the user can view the approval queue AND rules.approve is enabled', () => {
        canViewApprovalQueue = true;
        renderNav({ 'rules.approve': true });
        expect(count('Approve Rules')).toBeGreaterThan(0);
    });

    it('hides Approve Rules when rules.approve is disabled even if the user can view the approval queue', () => {
        canViewApprovalQueue = true;
        renderNav({ 'rules.approve': false });
        expect(count('Approve Rules')).toBe(0);
    });

    it('hides Approve Rules when the user cannot view the approval queue even if rules.approve is enabled', () => {
        canViewApprovalQueue = false;
        renderNav({ 'rules.approve': true });
        expect(count('Approve Rules')).toBe(0);
    });
});
