import { act, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeatureProvider } from '@/component-library/features/feature-flags/FeatureProvider';
import { FeatureFlagMap, FEATURE_REGISTRY, FeatureKey } from '@/lib/core/entity/feature-config';
import { AMITagsRow } from '@/component-library/features/ami/AMITagsRow';

const NAME = 'data26_hi.00523138.physics_HardProbes.merge.AOD.f1723_m2281._lb0490._0003.1';

const RESPONSE = JSON.stringify({
    status: 'success',
    tags: [
        { tag: 'f1723', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=f1723', found: true },
        { tag: 'm2281', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=m2281', found: true },
    ],
});

function flags(amiTags: boolean): FeatureFlagMap {
    const map = {} as FeatureFlagMap;
    (Object.keys(FEATURE_REGISTRY) as FeatureKey[]).forEach(k => (map[k] = true));
    map['dids.ami_tags'] = amiTags;
    return map;
}

function renderRow(name: string, amiTags: boolean) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <FeatureProvider features={flags(amiTags)}>
                <AMITagsRow name={name} />
            </FeatureProvider>
        </QueryClientProvider>,
    );
}

describe('AMITagsRow', () => {
    beforeEach(() => fetchMock.resetMocks());

    it('renders nothing and makes no request when the flag is off', () => {
        const { container } = renderRow(NAME, false);
        expect(container).toBeEmptyDOMElement();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('renders nothing and makes no request when the name has no tags', () => {
        const { container } = renderRow('DAOD_LLP1.47616532._000665.pool.root.1', true);
        expect(container).toBeEmptyDOMElement();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('fetches tag info once and renders linked chips', async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({
                status: 'success',
                tags: [
                    { tag: 'f1723', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=f1723', found: true },
                    { tag: 'm2281', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=m2281', found: null },
                ],
            }),
        );
        renderRow(NAME, true);

        expect(screen.getByText('AMI Tags')).toBeInTheDocument();
        expect(screen.getByText('f1723')).toBeInTheDocument(); // plain chip while loading
        await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(2));
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0]).toBe('/api/feature/get-ami-tag-info?tags=f1723%2Cm2281');
    });

    it('keeps plain chips when the request fails', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
        renderRow(NAME, true);
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(screen.getByText('m2281')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
    it('keeps the cached result for an hour after unmount, so a later remount does not refetch', async () => {
        fetchMock.mockResponseOnce(RESPONSE);
        const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        const ui = (
            <QueryClientProvider client={client}>
                <FeatureProvider features={flags(true)}>
                    <AMITagsRow name={NAME} />
                </FeatureProvider>
            </QueryClientProvider>
        );
        const first = render(ui);
        await waitFor(() => expect(screen.queryAllByRole('link').length).toBeGreaterThan(0));
        jest.useFakeTimers();
        try {
            first.unmount();
            // Past React Query's default 5 minute gcTime, within our 1 hour staleTime
            act(() => {
                jest.advanceTimersByTime(10 * 60 * 1000);
            });
            render(ui);
            expect(screen.queryAllByRole('link').length).toBeGreaterThan(0);
            expect(fetchMock).toHaveBeenCalledTimes(1);
        } finally {
            jest.useRealTimers();
        }
    });
});
