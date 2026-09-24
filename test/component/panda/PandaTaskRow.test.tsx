import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeatureProvider } from '@/component-library/features/feature-flags/FeatureProvider';
import { FeatureFlagMap, FEATURE_REGISTRY, FeatureKey } from '@/lib/core/entity/feature-config';
import { PandaTaskRow } from '@/component-library/features/panda/PandaTaskRow';

const NAME = 'mc20_13TeV.830072.H7EG_jetjet_Lund_JZ1.deriv.DAOD_PHYS.e8419_s3681_r13167_r13146_p5855_tid34870879_00';

function flags(pandaTask: boolean): FeatureFlagMap {
    const map = {} as FeatureFlagMap;
    (Object.keys(FEATURE_REGISTRY) as FeatureKey[]).forEach(k => (map[k] = true));
    map['dids.panda_task'] = pandaTask;
    return map;
}

function renderRow(name: string, pandaTask: boolean) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <FeatureProvider features={flags(pandaTask)}>
                <PandaTaskRow name={name} />
            </FeatureProvider>
        </QueryClientProvider>,
    );
}

describe('PandaTaskRow', () => {
    beforeEach(() => fetchMock.resetMocks());

    it('renders nothing and makes no request when the flag is off', () => {
        const { container } = renderRow(NAME, false);
        expect(container).toBeEmptyDOMElement();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('renders nothing when the name has no PanDA task', () => {
        const { container } = renderRow('data25_13p6TeV.00499912.physics_TLA.merge.RAW', true);
        expect(container).toBeEmptyDOMElement();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('fetches the link and renders a linked chip', async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({ status: 'success', taskId: '34870879', url: 'https://bigpanda.cern.ch/task/?jeditaskid=34870879' }),
        );
        renderRow(NAME, true);

        expect(screen.getByText('PanDA Task')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByRole('link')).toHaveAttribute('href', 'https://bigpanda.cern.ch/task/?jeditaskid=34870879'));
        expect(fetchMock.mock.calls[0][0]).toBe('/api/feature/get-panda-task-link?taskId=34870879');
    });

    it('uses the task field of ATLAS file names', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ status: 'success', taskId: '47616532', url: 'https://bigpanda.cern.ch/task/?jeditaskid=47616532' }));
        renderRow('DAOD_LLP1.47616532._000665.pool.root.1', true);
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(fetchMock.mock.calls[0][0]).toBe('/api/feature/get-panda-task-link?taskId=47616532');
    });

    it('keeps a plain chip when the request fails', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
        renderRow(NAME, true);
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(screen.getByText('34870879')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
});
