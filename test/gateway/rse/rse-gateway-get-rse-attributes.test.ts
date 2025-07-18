import RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('RSEGateway GET RSE Attributes Endpoint Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const getRSEAttributesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/MOCK3/attr/`,
            method: 'GET',
            includes: '/rses/MOCK3/attr',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ISP: 'CERN- LHC',
                    MOCK3: true,
                    continent: 'EU',
                    country_name: 'Switzerland',
                    region_code: '07',
                    time_zone: 'Europe/Zurich',
                }),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [getRSEAttributesMockEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    test('it should get RSE attributes', async () => {
        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE);
        const rseAttributesDTO = await rseGateway.getRSEAttributes(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'MOCK3');
        expect(rseAttributesDTO).toEqual({
            status: 'success',
            attributes: [
                {
                    key: 'ISP',
                    value: 'CERN- LHC',
                },
                {
                    key: 'MOCK3',
                    value: true,
                },
                {
                    key: 'continent',
                    value: 'EU',
                },
                {
                    key: 'country_name',
                    value: 'Switzerland',
                },
                {
                    key: 'region_code',
                    value: '07',
                },
                {
                    key: 'time_zone',
                    value: 'Europe/Zurich',
                },
            ],
        });
    });
});
