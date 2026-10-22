import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import { ListFileReplicasRequest } from '@/lib/core/usecase-models/list-file-replicas-usecase-models';
import { ListFileReplicasControllerParameters } from '@/lib/infrastructure/controller/list-file-replicas-controller';
import { ReplicaState } from '@/lib/core/entity/rucio';

const XRD1_PFN = 'root://xrd1:1094//rucio/test/80/25/file1';

const replicaRecord = {
    scope: 'test',
    name: 'file1',
    bytes: 10485760,
    md5: '8dac2767785de1cdad6b1681db77b531',
    adler32: '6ee5e505',
    pfns: {
        [XRD1_PFN]: { rse_id: 'id1', rse: 'XRD1', type: 'DISK', volatile: false, domain: 'wan', priority: 1, client_extract: false },
    },
    rses: { XRD1: [XRD1_PFN] },
    states: { XRD1: 'AVAILABLE', XRD3: 'COPYING' },
};

describe('List File Replicas Feature tests', () => {
    let capturedBody: any;
    let capturedHeaders: Headers | undefined;

    const mockListReplicas = (status: number, body: string | Readable, headers: Record<string, string> = {}) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/list`,
            method: 'POST',
            includes: 'replicas/list',
            requestValidator: async (req: Request) => {
                capturedBody = JSON.parse(await req.text());
                capturedHeaders = req.headers;
                return true;
            },
            response: {
                status: status,
                headers: { 'Content-Type': 'application/x-json-stream', ...headers },
                body: body,
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    };

    const execute = async (params: Partial<ListFileReplicasControllerParameters>) => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller = appContainer.get<BaseController<ListFileReplicasControllerParameters, ListFileReplicasRequest>>(
            CONTROLLERS.LIST_FILE_REPLICAS,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            scope: 'test',
            name: 'file1',
            ...params,
        } as ListFileReplicasControllerParameters);
        return res;
    };

    const collect = async (res: ReturnType<typeof MockHttpStreamableResponseFactory.getMockResponse>) => {
        const receivedData: any[] = [];
        const onData = (data: any) => receivedData.push(JSON.parse(data));
        await new Promise<void>((resolve, reject) => {
            res.on('data', onData);
            res.on('end', () => {
                res.off('data', onData);
                resolve();
            });
            res.on('error', err => {
                res.off('data', onData);
                reject(err);
            });
        });
        return receivedData;
    };

    beforeEach(() => {
        fetchMock.doMock();
        capturedBody = undefined;
        capturedHeaders = undefined;
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('streams one row per PFN and keeps replicas without a PFN', async () => {
        mockListReplicas(200, Readable.from([JSON.stringify(replicaRecord)]));

        const receivedData = await collect(await execute({}));

        expect(receivedData).toEqual([
            {
                status: 'success',
                scope: 'test',
                name: 'file1',
                bytes: 10485760,
                adler32: '6ee5e505',
                rse: 'XRD1',
                state: ReplicaState.AVAILABLE,
                pfn: XRD1_PFN,
                protocol: 'root',
                domain: 'wan',
                priority: 1,
                rseType: 'DISK',
            },
            {
                status: 'success',
                scope: 'test',
                name: 'file1',
                bytes: 10485760,
                adler32: '6ee5e505',
                rse: 'XRD3',
                state: ReplicaState.COPYING,
                pfn: null,
                protocol: null,
                domain: null,
                priority: null,
                rseType: null,
            },
        ]);
    });

    it('forwards the options and the client IP to Rucio', async () => {
        mockListReplicas(200, Readable.from([JSON.stringify(replicaRecord)]));

        await collect(
            await execute({
                schemes: ['root', 'DAVS'],
                domain: 'lan',
                rseExpression: '  tier=1  ',
                allStates: false,
                clientIp: '188.184.21.108',
            }),
        );

        expect(capturedBody).toEqual({
            dids: [{ scope: 'test', name: 'file1' }],
            all_states: false,
            ignore_availability: true,
            schemes: ['root', 'davs'],
            domain: 'lan',
            rse_expression: 'tier=1',
        });
        expect(capturedHeaders?.get('X-Forwarded-For')).toBe('188.184.21.108');
    });

    it('rejects an unknown domain before calling Rucio', async () => {
        mockListReplicas(200, Readable.from([JSON.stringify(replicaRecord)]));

        const res = await execute({ domain: 'bogus' as any });

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toMatchObject({ status: 'error', errorType: 'invalid_domain' });
        expect(capturedBody).toBeUndefined();
    });

    it('rejects a scheme that is not a scheme name', async () => {
        mockListReplicas(200, Readable.from([JSON.stringify(replicaRecord)]));

        const res = await execute({ schemes: ['root', 'https://evil'] });

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toMatchObject({ status: 'error', errorType: 'invalid_scheme' });
        expect(capturedBody).toBeUndefined();
    });

    it('maps InvalidRSEExpression from Rucio to a 400 with a typed error', async () => {
        mockListReplicas(
            500,
            JSON.stringify({ ExceptionClass: 'InvalidRSEExpression', ExceptionMessage: 'RSE Expression resulted in an empty set.' }),
            { 'Content-Type': 'application/json', ExceptionClass: 'InvalidRSEExpression' },
        );

        const res = await execute({ rseExpression: 'NOPE' });

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toMatchObject({ status: 'error', errorType: 'invalid_rse_expression' });
    });

    it('maps an expired token to unauthorized', async () => {
        mockListReplicas(200, Readable.from([JSON.stringify(replicaRecord)]));

        const res = await execute({ rucioAuthToken: 'expired' });

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toMatchObject({ status: 'error', errorType: 'unauthorized' });
    });
});
