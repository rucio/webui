import { BaseController } from '@/lib/sdk/controller';
import { ListDIDsRequest } from '@/lib/core/usecase-models/list-dids-usecase-models';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller';
import { NextApiResponse } from 'next';
import { Readable } from 'stream';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const searchHop = (type: 'container' | 'dataset' | 'file', names: string[]): MockEndpoint => ({
    url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dids/search`,
    method: 'GET',
    includes: `type=${type}`,
    response: {
        status: 200,
        headers: { 'Content-Type': 'application/x-json-stream' },
        body: Readable.from(names.map(name => `"${name}"\n`).join('')),
    },
});

const statusEndpoint = (name: string, type: string): MockEndpoint => ({
    url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/${name}/status?dynamic_depth=FILE`,
    method: 'GET',
    response: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            scope: 'test',
            name,
            type,
            account: 'root',
            open: true,
            monotonic: false,
            expired_at: null,
            length: 1,
            bytes: 1,
        }),
    },
});

const runCascade = async (query: string, endpoints: MockEndpoint[]) => {
    MockRucioServerFactory.createMockRucioServer(true, endpoints);

    const res = MockHttpStreamableResponseFactory.getMockResponse();
    const controller = appContainer.get<BaseController<ListDIDsControllerParameters, ListDIDsRequest>>(CONTROLLERS.LIST_DIDS);
    await controller.execute({
        response: res as unknown as NextApiResponse,
        rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
        query,
        type: 'all',
        filters: [],
    } as ListDIDsControllerParameters);

    const received: any[] = [];
    const onData = (data: any) => received.push(JSON.parse(data));
    await new Promise<void>((resolve, reject) => {
        res.on('data', onData);
        res.on('end', () => {
            res.off('data', onData);
            resolve();
        });
        res.on('error', reject);
    });
    return { received, res };
};

const dids = (received: any[]) => received.filter(r => (r.kind ?? 'did') === 'did');
const progress = (received: any[]) => received.filter(r => r.kind === 'progress');
const notices = (received: any[]) => received.filter(r => r.kind === 'notice');

describe('List DIDs cascade under the All type', () => {
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    it('shows containers and datasets together when both match', async () => {
        const { received } = await runCascade('test:data1', [
            searchHop('container', ['container1']),
            searchHop('dataset', ['dataset1']),
            searchHop('file', ['file1']),
            statusEndpoint('container1', 'CONTAINER'),
            statusEndpoint('dataset1', 'DATASET'),
        ]);

        expect(dids(received).map(r => r.name)).toEqual(['container1', 'dataset1']);
        expect(notices(received)).toHaveLength(0);
    });

    it('does not search files when a collection matched', async () => {
        let fileHopCalled = false;
        const fileHop = searchHop('file', ['file1']);
        fileHop.requestValidator = async () => {
            fileHopCalled = true;
            return true;
        };

        await runCascade('test:data1', [
            searchHop('container', ['container1']),
            searchHop('dataset', []),
            fileHop,
            statusEndpoint('container1', 'CONTAINER'),
        ]);

        expect(fileHopCalled).toEqual(false);
    });

    it('falls through to datasets when containers are empty', async () => {
        const { received } = await runCascade('test:data1', [
            searchHop('container', []),
            searchHop('dataset', ['dataset1']),
            searchHop('file', ['file1']),
            statusEndpoint('dataset1', 'DATASET'),
        ]);

        expect(dids(received).map(r => r.name)).toEqual(['dataset1']);
        expect(progress(received).some(p => p.progress.state === 'found' && p.progress.types.includes('Dataset'))).toEqual(true);
    });

    it('falls through to files when containers and datasets are empty and the name has no wildcard', async () => {
        const { received } = await runCascade('test:data1', [
            searchHop('container', []),
            searchHop('dataset', []),
            searchHop('file', ['file1']),
            statusEndpoint('file1', 'FILE'),
        ]);

        expect(dids(received).map(r => r.name)).toEqual(['file1']);
        expect(progress(received).some(p => p.progress.state === 'searching' && p.progress.types.includes('File'))).toEqual(true);
        expect(progress(received).some(p => p.progress.state === 'found' && p.progress.types.includes('File'))).toEqual(true);
    });

    it('asks the user to refine a wildcard name instead of searching files', async () => {
        let fileHopCalled = false;
        const fileHop = searchHop('file', ['file1']);
        fileHop.requestValidator = async () => {
            fileHopCalled = true;
            return true;
        };

        const { received } = await runCascade('test:data*', [searchHop('container', []), searchHop('dataset', []), fileHop]);

        expect(fileHopCalled).toEqual(false);
        expect(dids(received)).toHaveLength(0);
        expect(notices(received).map(n => n.notice.code)).toEqual(['refine-wildcard']);
    });

    it('says files were skipped when a wildcard search did find collections', async () => {
        const { received } = await runCascade('test:data*', [
            searchHop('container', ['container1']),
            searchHop('dataset', ['dataset1']),
            statusEndpoint('container1', 'CONTAINER'),
            statusEndpoint('dataset1', 'DATASET'),
        ]);

        expect(dids(received).map(r => r.name)).toEqual(['container1', 'dataset1']);
        // The user still needs to know files were left out, even though results came back.
        expect(notices(received).map(n => n.notice.code)).toEqual(['files-skipped']);
    });

    it('treats % as a wildcard too, so it cannot slip past the file gate', async () => {
        let fileHopCalled = false;
        const fileHop = searchHop('file', ['file1']);
        fileHop.requestValidator = async () => {
            fileHopCalled = true;
            return true;
        };

        // Rucio treats % exactly like *, and the page tips tell users so.
        const { received } = await runCascade('test:data%', [searchHop('container', []), searchHop('dataset', []), fileHop]);

        expect(fileHopCalled).toEqual(false);
        expect(notices(received).map(n => n.notice.code)).toEqual(['refine-wildcard']);
    });

    it('says files were skipped for a % wildcard that did find collections', async () => {
        const { received } = await runCascade('test:data%', [
            searchHop('container', ['container1']),
            searchHop('dataset', []),
            statusEndpoint('container1', 'CONTAINER'),
        ]);

        expect(dids(received).map(r => r.name)).toEqual(['container1']);
        expect(notices(received).map(n => n.notice.code)).toEqual(['files-skipped']);
    });

    it('does not say files were skipped when the name carries no wildcard', async () => {
        const { received } = await runCascade('test:data1', [
            searchHop('container', ['container1']),
            searchHop('dataset', []),
            statusEndpoint('container1', 'CONTAINER'),
        ]);

        expect(notices(received)).toHaveLength(0);
    });

    it('reports no results when every hop is empty', async () => {
        const { received } = await runCascade('test:data1', [searchHop('container', []), searchHop('dataset', []), searchHop('file', [])]);

        expect(dids(received)).toHaveLength(0);
        expect(notices(received).map(n => n.notice.code)).toEqual(['no-results']);
    });

    it('orders containers before datasets so the coarser collections read first', async () => {
        const { received } = await runCascade('test:data1', [
            searchHop('container', ['containerA', 'containerB']),
            statusEndpoint('containerA', 'CONTAINER'),
            statusEndpoint('containerB', 'CONTAINER'),
            searchHop('dataset', ['datasetA']),
            statusEndpoint('datasetA', 'DATASET'),
        ]);

        expect(dids(received).map(r => r.name)).toEqual(['containerA', 'containerB', 'datasetA']);
    });

    it('fails with an HTTP error rather than a stream when the container hop is unauthorized', async () => {
        const runWithBadToken = async (type: string) => {
            MockRucioServerFactory.createMockRucioServer(true, [searchHop('container', []), searchHop('dataset', [])]);

            const res = MockHttpStreamableResponseFactory.getMockResponse();
            const controller = appContainer.get<BaseController<ListDIDsControllerParameters, ListDIDsRequest>>(CONTROLLERS.LIST_DIDS);
            await controller.execute({
                response: res as unknown as NextApiResponse,
                rucioAuthToken: 'an-invalid-token',
                query: 'test:data1',
                type,
                filters: [],
            } as ListDIDsControllerParameters);

            return res;
        };

        const cascadeResponse = await runWithBadToken('all');
        const pinnedResponse = await runWithBadToken('dataset');

        // The cascade must not degrade the error path: an unauthorized request has to
        // reach the client as an HTTP status, exactly as a pinned-type search does.
        expect(cascadeResponse.statusCode).toBeGreaterThanOrEqual(400);
        expect(cascadeResponse.statusCode).toEqual(pinnedResponse.statusCode);
    });

    it('stops the cascade when the client disconnects before the file hop', async () => {
        let fileHopCalled = false;
        const fileHop = searchHop('file', ['file1']);
        fileHop.requestValidator = async () => {
            fileHopCalled = true;
            return true;
        };

        MockRucioServerFactory.createMockRucioServer(true, [searchHop('container', []), searchHop('dataset', []), fileHop]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller = appContainer.get<BaseController<ListDIDsControllerParameters, ListDIDsRequest>>(CONTROLLERS.LIST_DIDS);

        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            query: 'test:data1',
            type: 'all',
            filters: [],
        } as ListDIDsControllerParameters);

        // What Next.js emits when the client goes away. This has to fire here, after
        // execute() resolves but before the wait below: execute() returns as soon as the
        // PassThrough is handed back, so the cascade is still mid-flight. Waiting first
        // would let it reach the file hop and the test would prove nothing.
        res.emit('close');

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(fileHopCalled).toEqual(false);
    });
    it('reports a failing dataset hop instead of silently searching on', async () => {
        const brokenDatasetHop: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dids/search`,
            method: 'GET',
            includes: 'type=dataset',
            response: { status: 500, headers: null, body: null },
        };

        const { received } = await runCascade('test:data1', [
            searchHop('container', []),
            brokenDatasetHop,
            searchHop('file', ['file1']),
            statusEndpoint('file1', 'FILE'),
        ]);

        expect(received.some(r => r.status === 'error')).toEqual(true);
        expect(notices(received).map(n => n.notice.code)).not.toContain('no-results');
    });

    it('reports a failing file hop rather than claiming nothing matched', async () => {
        const brokenFileHop: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dids/search`,
            method: 'GET',
            includes: 'type=file',
            response: { status: 500, headers: null, body: null },
        };

        const { received } = await runCascade('test:data1', [searchHop('container', []), searchHop('dataset', []), brokenFileHop]);

        expect(received.some(r => r.status === 'error')).toEqual(true);
        expect(notices(received).map(n => n.notice.code)).not.toContain('no-results');
    });
});
