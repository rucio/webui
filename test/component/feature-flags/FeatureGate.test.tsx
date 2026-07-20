import { render, screen } from '@testing-library/react';
import { FeatureProvider } from '@/component-library/features/feature-flags/FeatureProvider';
import { FeatureGate } from '@/component-library/features/feature-flags/FeatureGate';
import { FeatureFlagMap } from '@/lib/core/entity/feature-config';

const baseMap: FeatureFlagMap = {
    rules: true,
    'rules.create': true,
    'rules.approve': true,
    subscriptions: true,
    rses: true,
    'dids.metadata': false,
    'dids.mutate': true,
};

describe('FeatureGate', () => {
    it('renders children when the feature is enabled', () => {
        render(
            <FeatureProvider features={baseMap}>
                <FeatureGate feature="rules"><span>shown</span></FeatureGate>
            </FeatureProvider>,
        );
        expect(screen.getByText('shown')).toBeInTheDocument();
    });

    it('renders the fallback when the feature is disabled', () => {
        render(
            <FeatureProvider features={baseMap}>
                <FeatureGate feature="dids.metadata" fallback={<span>hidden-fallback</span>}>
                    <span>shown</span>
                </FeatureGate>
            </FeatureProvider>,
        );
        expect(screen.queryByText('shown')).not.toBeInTheDocument();
        expect(screen.getByText('hidden-fallback')).toBeInTheDocument();
    });

    it('treats a missing provider as disabled', () => {
        render(<FeatureGate feature="rules"><span>shown</span></FeatureGate>);
        expect(screen.queryByText('shown')).not.toBeInTheDocument();
    });
});
