import { RSEProtocolDTO } from "@/lib/core/dto/rse-dto";
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
                          "third_party_copy_read": 1,
                          "third_party_copy_write": 1,
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
        const rseProtocolDTO: RSEProtocolDTO = await rseGateway.getRSEProtocols(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'MOCK3')
        expect(rseProtocolDTO).toBeDefined()
        expect(rseProtocolDTO.status).toEqual('success')
        expect(rseProtocolDTO.protocols).toEqual([
            {
              "rseid": "MOCK3",
              "scheme": "file",
              "hostname": "localhost",
              "port": 0,
              "prefix": "/tmp/rucio_rse/",
              "impl": "rucio.rse.protocols.posix.Default",
              "priorities_lan": {
                "read": 1,
                "write": 1,
                "delete": 1
              },
              "priorities_wan": {
                "read": 1,
                "write": 1,
                "delete": 1,
                "tpcread": 0,
                "tpcwrite": 0
              },
            },
            {
              "rseid": "MOCK3",
              "scheme": "https",
              "hostname": "mock3.com",
              "port": 2880,
              "prefix": "/pnfs/rucio/disk-only/scratchdisk/",
              "impl": "rucio.rse.protocols.webdav.Default",
              "priorities_lan": {
                "read": 1,
                "write": 1,
                "delete": 1
              },
              "priorities_wan": {
                "read": 1,
                "write": 1,
                "delete": 1,
                "tpcread": 0,
                "tpcwrite": 0
              },
            },
            {
              "rseid": "MOCK3",
              "scheme": "srm",
              "hostname": "mock3.com",
              "port": 8443,
              "prefix": "/rucio/tmpdisk/rucio_tests/",
              "impl": "rucio.rse.protocols.srm.Default",
              "priorities_lan": {
                "read": 1,
                "write": 1,
                "delete": 1
              },
              "priorities_wan": {
                "read": 1,
                "write": 1,
                "delete": 1,
                "tpcread": 1,
                "tpcwrite": 1
              },
            }
          ])


    })
    
      afterEach(() => {
        fetchMock.dontMock();
    })
})