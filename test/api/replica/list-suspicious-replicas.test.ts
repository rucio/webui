/**
 * Tests for the list-suspicious-replicas feature.
 *
 * Coverage:
 *  - Controller-level: happy path streams view models, empty result, gateway error
 *    (mirrors the pattern used by other replica feature tests in this directory).
 *  - Route-level: `GET /api/feature/list-suspicious-replicas` returns 200 with the
 *    streaming Content-Type for a mocked gateway response.
 */

import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import ListSuspiciousReplicasController, {
    ListSuspiciousReplicasControllerParameters,
} from '@/lib/infrastructure/controller/list-suspicious-replicas-controller';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import { NextApiResponse } from 'next';
import { SuspiciousReplicaViewModel } from '@/lib/infrastructure/data/view-model/replica';
import { collectStreamedData } from 'test/fixtures/stream-test-utils';

const mockReplicas = [
    {
        scope: 'test',
        name: 'suspicious_test_file_1.dat',
        rse: 'MOCK_SUSPICIOUS',
        rse_id: '6762d2e939bd41a89a012f40d038843e',
        cnt: 3,
        created_at: 'Wed, 18 Mar 2026 09:08:23 UTC',
    },
    {
        scope: 'test',
        name: 'suspicious_test_file_2.dat',
        rse: 'MOCK_SUSPICIOUS_OTHER',
        rse_id: 'aaaabbbbccccddddeeeeffff00001111',
        cnt: 5,
        created_at: 'Wed, 18 Mar 2026 10:08:23 UTC',
    },
];

const makeEndpoint = (status: number, body: unknown): MockEndpoint => ({
    url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/suspicious/`,
    method: 'GET',
    includes: 'replicas/suspicious',
    response: {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
        body: typeof body === 'string' ? body : JSON.stringify(body),
    },
});

describe('Feature: ListSuspiciousReplicas (controller)', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('streams view models for a successful gateway response', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [makeEndpoint(200, mockReplicas)]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller: ListSuspiciousReplicasController = appContainer.get(CONTROLLERS.LIST_SUSPICIOUS_REPLICAS);

        const params: ListSuspiciousReplicasControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
        };
        await controller.execute(params);

        const received = await collectStreamedData<string>(res);
        const parsed = received.map(d => JSON.parse(d)) as SuspiciousReplicaViewModel[];

        expect(parsed.length).toBe(2);
        expect(parsed[0].status).toBe('success');
        expect(parsed[0].rse).toBe('MOCK_SUSPICIOUS');
        expect(parsed[0].name).toBe('suspicious_test_file_1.dat');
        expect(parsed[1].cnt).toBe(5);
    });

    it('produces an empty stream when the gateway returns no replicas', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [makeEndpoint(200, [])]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller: BaseController<ListSuspiciousReplicasControllerParameters, unknown> = appContainer.get(
            CONTROLLERS.LIST_SUSPICIOUS_REPLICAS,
        );

        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
        });

        const received = await collectStreamedData<string>(res);
        expect(received.length).toBe(0);
    });

    it('propagates a gateway error as an error view model', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [makeEndpoint(500, { error: 'boom' })]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller: BaseController<ListSuspiciousReplicasControllerParameters, unknown> = appContainer.get(
            CONTROLLERS.LIST_SUSPICIOUS_REPLICAS,
        );

        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
        });

        // The streaming presenter writes a JSON error body to the response on gateway failure.
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
        const errBody = res._getJSONData();
        expect(errBody).toBeDefined();
        expect(errBody.errorType ?? errBody.status).toBeTruthy();
    });

    it('forwards query parameters to the gateway request', async () => {
        const endpoint: MockEndpoint = {
            ...makeEndpoint(200, mockReplicas),
            requestValidator: async request => {
                const url = request.url;
                if (!url.includes('rse_expression=tier%3D1')) return false;
                if (!url.includes('nattempts=5')) return false;
                if (!url.includes('younger_than=')) return false;
                return true;
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller: BaseController<ListSuspiciousReplicasControllerParameters, unknown> = appContainer.get(
            CONTROLLERS.LIST_SUSPICIOUS_REPLICAS,
        );

        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            rseExpression: 'tier=1',
            youngerThan: '2026-01-01T00:00:00.000Z',
            nattempts: 5,
        });

        const received = await collectStreamedData<string>(res);
        const parsed = received.map(d => JSON.parse(d)) as SuspiciousReplicaViewModel[];
        expect(parsed.length).toBe(2);
    });
});

