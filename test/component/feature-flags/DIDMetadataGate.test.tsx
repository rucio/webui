import { render, screen } from '@testing-library/react';
import { FeatureProvider } from '@/component-library/features/feature-flags/FeatureProvider';
import { FeatureFlagMap } from '@/lib/core/entity/feature-config';
import { DetailsDIDTables } from '@/component-library/pages/DID/details/DetailsDID';
import { DIDType } from '@/lib/core/entity/rucio';

jest.mock('@/component-library/pages/DID/details/views/DetailsDIDAttributes', () => ({
    DetailsDIDAttributes: () => <div>attributes-view</div>,
}));
jest.mock('@/component-library/pages/DID/details/views/DetailsDIDFileReplicas', () => ({
    DetailsDIDFileReplicas: () => <div>replicas-view</div>,
}));
jest.mock('@/component-library/pages/DID/details/views/DetailsDIDDatasetReplicas', () => ({
    DetailsDIDDatasetReplicas: () => <div>dataset-replicas-view</div>,
}));
jest.mock('@/component-library/pages/DID/details/views/DetailsDIDRules', () => ({
    DetailsDIDRules: () => <div>rules-view</div>,
}));
jest.mock('@/component-library/pages/DID/details/views/DetailsDIDParents', () => ({
    DetailsDIDParents: () => <div>parents-view</div>,
}));
jest.mock('@/component-library/pages/DID/details/views/DetailsDIDContents', () => ({
    DetailsDIDContents: () => <div>contents-view</div>,
}));
jest.mock('@/component-library/pages/DID/details/views/DetailsDIDContentsReplicas', () => ({
    DetailsDIDContentsReplicas: () => <div>contents-replicas-view</div>,
}));

const baseMap: FeatureFlagMap = {
    rules: true,
    'rules.create': true,
    'rules.approve': true,
    subscriptions: true,
    rses: true,
    'dids.metadata': true,
    'dids.mutate': true,
};

describe('dids.metadata gate on the Attributes tab', () => {
    it('shows the Attributes tab when dids.metadata is enabled', () => {
        render(
            <FeatureProvider features={{ ...baseMap, 'dids.metadata': true }}>
                <DetailsDIDTables scope="test" name="did" type={'Dataset' as DIDType} />
            </FeatureProvider>,
        );
        expect(screen.getByText('Attributes')).toBeInTheDocument();
    });

    it('hides the Attributes tab but keeps other tabs when dids.metadata is disabled', () => {
        render(
            <FeatureProvider features={{ ...baseMap, 'dids.metadata': false }}>
                <DetailsDIDTables scope="test" name="did" type={'Dataset' as DIDType} />
            </FeatureProvider>,
        );
        expect(screen.queryByText('Attributes')).not.toBeInTheDocument();
        expect(screen.getByText('Rules')).toBeInTheDocument();
    });
});
