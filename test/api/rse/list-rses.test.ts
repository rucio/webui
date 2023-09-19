import { RSEType } from "@/lib/core/entity/rucio";
import { ListRSEsRequest } from "@/lib/core/usecase-models/list-rses-usecase-models";
import { ListRSEsControllerParameters } from "@/lib/infrastructure/controller/list-rses-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiResponse } from "next";
import { Readable } from "stream";
import { MockHttpStreamableResponseFactory } from "test/fixtures/http-fixtures";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe("List RSEs Feature tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const rseStream = Readable.from([
            JSON.stringify({"id": "ANONYMOUS_ID_1", "rse": "ANONYMOUS_RSE_1", "vo": "def", "rse_type": "DISK", "deterministic": true, "volatile": false, "staging_area": false, "city": null, "region_code": null, "country_name": null, "continent": null, "time_zone": null, "ISP": null, "ASN": null, "longitude": null, "latitude": null, "availability": 7, "availability_read": true, "availability_write": true, "availability_delete": true, "qos_class": null, "deleted": false, "deleted_at": null, "created_at": "Thu, 03 Aug 2023 11:37:48 UTC", "updated_at": "Thu, 03 Aug 2023 11:37:48 UTC"}),
            JSON.stringify({"id": "ANONYMOUS_ID_2", "rse": "ANONYMOUS_RSE_2", "vo": "def", "rse_type": "DISK", "deterministic": true, "volatile": false, "staging_area": false, "city": null, "region_code": null, "country_name": null, "continent": null, "time_zone": null, "ISP": null, "ASN": null, "longitude": null, "latitude": null, "availability": 7, "availability_read": true, "availability_write": true, "availability_delete": true, "qos_class": null, "deleted": false, "deleted_at": null, "created_at": "Thu, 03 Aug 2023 11:37:48 UTC", "updated_at": "Thu, 03 Aug 2023 11:37:48 UTC"}),
            JSON.stringify({"id": "ANONYMOUS_ID_3", "rse": "ANONYMOUS_RSE_3", "vo": "def", "rse_type": "DISK", "deterministic": true, "volatile": false, "staging_area": false, "city": null, "region_code": null, "country_name": null, "continent": null, "time_zone": null, "ISP": null, "ASN": null, "longitude": null, "latitude": null, "availability": 7, "availability_read": true, "availability_write": true, "availability_delete": true, "qos_class": null, "deleted": false, "deleted_at": null, "created_at": "Thu, 03 Aug 2023 11:37:48 UTC", "updated_at": "Thu, 03 Aug 2023 11:37:48 UTC"}),
        ].join('\n'))

        const listRSEsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses`,
            method: 'GET',
            includes: 'rses',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: rseStream
            }
        }

        MockRucioServerFactory.createMockRucioServer(true, [listRSEsEndpoint]);
    })

    afterEach(() => {
        fetchMock.dontMock();
    });
    
    it("should list rses as a stream", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()

        const controller = appContainer.get<BaseController<ListRSEsControllerParameters, ListRSEsRequest>>(CONTROLLERS.LIST_RSES);
        const controllerParams: ListRSEsControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            rseExpression: ''
        }

        await controller.execute(controllerParams);

        const receivedData: any[] = []
        const onData = (data: any) => {
            receivedData.push(JSON.parse(data))
        }

        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData)
            res.on('end', () => {
                res.off('data', onData)
                resolve()
            })
            res.on('error', err => {
                res.off('data', onData)
                reject(err)
            })
        })
        
        await done

        expect(receivedData.length).toEqual(3)
        expect(receivedData[0].id).toEqual('ANONYMOUS_ID_1')
        expect(receivedData[0].rse_type).toEqual(RSEType.DISK)
    });

})