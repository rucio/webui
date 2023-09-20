import { RSEType } from '@/lib/core/entity/rucio'
import { ListAllRSEsRequest } from '@/lib/core/usecase-models/list-all-rses-usecase-models'
import { ListAllRSEsControllerParameters } from '@/lib/infrastructure/controller/list-all-rses-controller'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers'
import { BaseController } from '@/lib/sdk/controller'
import { NextApiResponse } from 'next'
import { Readable } from 'stream'
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures'
import MockRucioServerFactory, {
    MockEndpoint,
} from 'test/fixtures/rucio-server'

describe('List RSEs Feature tests', () => {
    beforeEach(() => {
        fetchMock.doMock()
        const rseStream = Readable.from([
            JSON.stringify({"rse": "SWIFT", "region_code": null, "availability": 7, "created_at": "Tue, 19 Sep 2023 13:19:02 UTC", "vo": "def", "country_name": null, "availability_read": true, "updated_at": "Tue, 19 Sep 2023 13:19:02 UTC", "rse_type": "DISK", "continent": null, "availability_write": true, "deterministic": true, "time_zone": null, "availability_delete": true, "volatile": false, "ISP": null, "qos_class": null, "staging_area": false, "ASN": null, "deleted": false, "id": "59fcad356a68434cbe8c43737ccb3f83", "city": null, "longitude": null, "deleted_at": null, "latitude": null}),
            JSON.stringify({"rse": "AMAZON-BOTO", "region_code": null, "availability": 7, "created_at": "Tue, 19 Sep 2023 13:19:02 UTC", "vo": "def", "country_name": null, "availability_read": true, "updated_at": "Tue, 19 Sep 2023 13:19:02 UTC", "rse_type": "DISK", "continent": null, "availability_write": true, "deterministic": true, "time_zone": null, "availability_delete": true, "volatile": false, "ISP": null, "qos_class": null, "staging_area": false, "ASN": null, "deleted": false, "id": "328c926f09ea4dc0a5ddfbe62c8e3bd5", "city": null, "longitude": null, "deleted_at": null, "latitude": null}),
        ].join('\n'))

        const listAllRSEsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses`,
            method: 'GET',
            includes: 'rses',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: rseStream,
            },
        }
        
        MockRucioServerFactory.createMockRucioServer(true, [listAllRSEsEndpoint])
    })

    afterEach(() => {
        fetchMock.dontMock()
    })

    it('should list rses as a stream', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()
        const controller = appContainer.get<
            BaseController<ListAllRSEsControllerParameters, ListAllRSEsRequest>
        >(CONTROLLERS.LIST_ALL_RSES)
        const controllerParams: ListAllRSEsControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        }

        await controller.execute(controllerParams)

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

        expect(receivedData.length).toEqual(2)
        expect(receivedData[0].id).toEqual('59fcad356a68434cbe8c43737ccb3f83')
        expect(receivedData[0].rse_type).toEqual(RSEType.DISK)
    })
})
