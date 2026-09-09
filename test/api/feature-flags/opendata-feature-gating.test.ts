import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { requireFeature } from '@/lib/infrastructure/feature-flags/require-feature';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';

jest.mock('@/component-library/pages/DID/list/ListOpenDataDIDs', () => ({
    ListOpenDataDIDs: () => null,
}));

jest.mock('@/lib/infrastructure/feature-flags/require-feature', () => ({
    requireFeature: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/infrastructure/adapters/with-feature', () => ({
    withFeature: jest.fn((_controller: symbol, handler: (...args: unknown[]) => unknown) => handler),
}));

describe('OpenData feature gating', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('API routes', () => {
        it('protects the get OpenData DID API route', async () => {
            await import('@/app/api/feature/get-opendata-did/route');

            expect(withFeature).toHaveBeenCalledTimes(1);
            expect(withFeature).toHaveBeenCalledWith(CONTROLLERS.OPENDATA_DID, expect.any(Function));
        });

        it('protects the list OpenData DIDs API route', async () => {
            await import('@/app/api/feature/list-opendata-dids/route');

            expect(withFeature).toHaveBeenCalledTimes(1);
            expect(withFeature).toHaveBeenCalledWith(CONTROLLERS.LIST_OPENDATA_DIDS, expect.any(Function));
        });
    });

    describe('page', () => {
        it('requires the opendata feature', async () => {
            const { default: Page } = await import('@/app/(rucio)/opendata/dids/page');

            await Page();

            expect(requireFeature).toHaveBeenCalledTimes(1);
            expect(requireFeature).toHaveBeenCalledWith('opendata');
        });
    });
});
