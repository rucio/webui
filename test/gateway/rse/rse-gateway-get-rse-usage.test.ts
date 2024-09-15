import { RSEUsageDTO } from '@/lib/core/dto/rse-dto';
import RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('RSEGateway GET RSE Usage Endpoint Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const getRSEUsageMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/XRD3/usage`,
            method: 'GET',
            includes: '/rses/XRD3/usage',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rse_id: '55a218820c3c4089a1eb74e299de40de',
                    source: 'rucio',
                    used: 41943040,
                    free: null,
                    total: 41943040,
                    files: 4,
                    updated_at: 'Wed, 21 Aug 2024 08:43:24 UTC',
                    rse: 'XRD3',
                }),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [getRSEUsageMockEndpoint]);
    });

    test('It should get RSE usage', async () => {
        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE);
        const rseUsageDTO: RSEUsageDTO = await rseGateway.getRSEUsage(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'XRD3');
        expect(rseUsageDTO).toBeDefined();
        expect(rseUsageDTO.status).toEqual('success');
        expect(rseUsageDTO).toEqual({
            status: 'success',
            rse_id: '55a218820c3c4089a1eb74e299de40de',
            source: 'rucio',
            used: 41943040,
            free: null,
            total: 41943040,
            files: 4,
            updated_at: 'Wed, 21 Aug 2024 08:43:24 UTC',
            rse: 'XRD3',
        });
    });

    test('It should return a 404 error if an RSE does not exist', async () => {
        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE);
        const rseUsageDTO: RSEUsageDTO = await rseGateway.getRSEUsage(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'MOCK');
        expect(rseUsageDTO).toBeDefined();
        expect(rseUsageDTO.status).toEqual('error');
        expect(rseUsageDTO.errorCode).toEqual(404);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
});
