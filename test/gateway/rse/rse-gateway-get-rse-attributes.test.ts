import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe('RSEGateway GET RSE Attributes Endpoint Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const getRSEAttributesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/MOCK3/attr`,
            method: 'GET',
            includes: '/rses/MOCK3/attr',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "ISP": "CERN- LHC",
                    "MOCK3": true,
                    "continent": "EU",
                    "country_name": "Switzerland",
                    "region_code": "07",
                    "time_zone": "Europe/Zurich"
                })
            }
        }

        MockRucioServerFactory.createMockRucioServer(true, [getRSEAttributesMockEndpoint]);
    })

    test('it should get RSE attributes', async () => {
        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE)
    })
    afterEach(() => {
        fetchMock.dontMock();
    })
})