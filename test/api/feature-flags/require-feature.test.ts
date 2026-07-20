const notFoundMock = jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
});
jest.mock('next/navigation', () => ({ notFound: () => notFoundMock() }));

import { requireFeature } from '@/lib/infrastructure/feature-flags/require-feature';

describe('requireFeature', () => {
    afterEach(() => {
        delete process.env['FEATURE_SUBSCRIPTIONS'];
        notFoundMock.mockClear();
    });

    it('does nothing when the feature is enabled', async () => {
        await expect(requireFeature('subscriptions')).resolves.toBeUndefined();
        expect(notFoundMock).not.toHaveBeenCalled();
    });

    it('calls notFound() when the feature is disabled', async () => {
        process.env['FEATURE_SUBSCRIPTIONS'] = 'false';
        await expect(requireFeature('subscriptions')).rejects.toThrow('NEXT_NOT_FOUND');
        expect(notFoundMock).toHaveBeenCalledTimes(1);
    });
});
