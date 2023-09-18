import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe('RSEGateway GET RSE Protocols Endpoint Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const getRSEProtocolsMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/MOCK3/protocols`,
            method: 'GET',
            includes: '/rses/MOCK3/protocols',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([
                    {
                      "domains": {
                        "lan": {
                          "delete": 1,
                          "read": 1,
                          "write": 1
                        },
                        "wan": {
                          "delete": 1,
                          "read": 1,
                          "third_party_copy_read": 0,
                          "third_party_copy_write": 0,
                          "write": 1
                        }
                      },
                      "extended_attributes": {
                        "space_token": "ATLASDATATAPE",
                        "web_service_path": "/srm/managerv2?SFN="
                      },
                      "hostname": "localhost",
                      "impl": "rucio.rse.protocols.posix.Default",
                      "port": 0,
                      "prefix": "/tmp/rucio_rse/",
                      "scheme": "file"
                    },
                    {
                      "domains": {
                        "lan": {
                          "delete": 1,
                          "read": 1,
                          "write": 1
                        },
                        "wan": {
                          "delete": 1,
                          "read": 1,
                          "third_party_copy_read": 0,
                          "third_party_copy_write": 0,
                          "write": 1
                        }
                      },
                      "extended_attributes": null,
                      "hostname": "mock3.com",
                      "impl": "rucio.rse.protocols.webdav.Default",
                      "port": 2880,
                      "prefix": "/pnfs/rucio/disk-only/scratchdisk/",
                      "scheme": "https"
                    },
                    {
                      "domains": {
                        "lan": {
                          "delete": 1,
                          "read": 1,
                          "write": 1
                        },
                        "wan": {
                          "delete": 1,
                          "read": 1,
                          "third_party_copy_read": 0,
                          "third_party_copy_write": 0,
                          "write": 1
                        }
                      },
                      "extended_attributes": {
                        "space_token": "RUCIODISK",
                        "web_service_path": "/srm/managerv2?SFN="
                      },
                      "hostname": "mock3.com",
                      "impl": "rucio.rse.protocols.srm.Default",
                      "port": 8443,
                      "prefix": "/rucio/tmpdisk/rucio_tests/",
                      "scheme": "srm"
                    }
                  ])
            }
        }

        MockRucioServerFactory.createMockRucioServer(true, [getRSEProtocolsMockEndpoint]);
    })

    test('it should get RSE protocols', async () => {
        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE)
    })
    afterEach(() => {
        fetchMock.dontMock();
    })
})