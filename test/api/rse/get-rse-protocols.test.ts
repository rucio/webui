import { GetRSEProtocolsRequest } from "@/lib/core/usecase-models/get-rse-protocols-usecase-models";
import { GetRSERequest } from "@/lib/core/usecase-models/get-rse-usecase-models";
import { GetRSEControllerParameters } from "@/lib/infrastructure/controller/get-rse-controller";
import GetRSEProtocolsController, { GetRSEProtocolsControllerParameters } from "@/lib/infrastructure/controller/get-rse-protocols-controller";
import { RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiResponse } from "next";
import { createHttpMocks } from "test/fixtures/http-fixtures";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe('GET RSE Protocols API Test', () => {
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

    afterEach(() => {
        fetchMock.dontMock();
    })

    test('it should get RSEProtcols for an RSE', async () => {
        const { req, res, session } = await createHttpMocks('/api/feature/get-rse?rseName=DINGDONGRSE', 'GET', {});
        const getRSEProtocolsController = appContainer.get<BaseController<GetRSEProtocolsControllerParameters, GetRSEProtocolsRequest>>(CONTROLLERS.GET_RSE_PROTOCOLS)
        const getRSEProtocolsControllerParameters: GetRSEProtocolsControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            rseName: 'MOCK3',
        }
        await getRSEProtocolsController.execute(getRSEProtocolsControllerParameters)
        const data = await res._getJSONData()
        expect(data).toEqual([
            {
                "status": "success",
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
                "status": "success",
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
                "status": "success",
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

    it('should return an auth error if the user is not authenticated', async () => {
        const { req, res, session } = await createHttpMocks('/api/feature/get-rse?rseName=DINGDONGRSE', 'GET', {});
        const getRSEProtocolsController = appContainer.get<BaseController<GetRSEProtocolsControllerParameters, GetRSEProtocolsRequest>>(CONTROLLERS.GET_RSE_PROTOCOLS)
        const getRSEProtocolsControllerParameters: GetRSEProtocolsControllerParameters = {
            rucioAuthToken: 'asdasdasd',
            response: res as unknown as NextApiResponse,
            rseName: 'MOCK3',
        }
        await getRSEProtocolsController.execute(getRSEProtocolsControllerParameters)
        const data = await res._getJSONData()
        expect(data.length).toEqual(1)
        expect(data[0].message).toEqual("The provided authentication token is invalid or has expired.")
    })
})