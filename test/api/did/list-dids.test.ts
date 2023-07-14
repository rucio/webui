import { BaseController } from '@/lib/sdk/controller'
import { ListDIDsRequest } from '@/lib/core/usecase-models/list-dids-usecase-models'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers'
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller'
import { NextApiResponse } from 'next'
import { Readable } from 'stream'
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures'
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server'

describe('DID API Tests', () => {
    beforeEach(() => {
        fetchMock.doMock()
        const listDIDsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/test/dids/search`,
            method: 'GET',
            includes: 'test/dids/search',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(
                    [
                        'test:dateset1',
                        'test:dataset2',
                        'test:dataset3',
                    ].join('\n'),
                ),
            },
        }

        const dataset1StatusEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/test/dataset1/status`,
            method: 'GET',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scope: 'test',
                    name: 'dataset1',
                    type: 'DATASET',
                    account: 'root',
                    open: true,
                    monotonic: false,
                    expired_at: null,
                    length: null,
                    bytes: null,
                }),
            },
        }

        MockRucioServerFactory.createMockRucioServer(true, [
            listDIDsEndpoint,
            dataset1StatusEndpoint,
        ])
    })
    afterEach(() => {
        fetchMock.dontMock()
    })

    it('Should successfully stream DIDs', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()
        const listDIDsController = appContainer.get<BaseController<ListDIDsControllerParameters, ListDIDsRequest>>(
            CONTROLLERS.LIST_DIDS,
        )
        const controllerParams: ListDIDsControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            query: "test:dataset1",
            type: "dataset"
        }
        await listDIDsController.execute(
            controllerParams,
        )

        const receivedData: string[] = []
        const onData = (data: string) => {
            receivedData.push(
                JSON.parse(data)
            )
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
        const str = "test:dataset1"
        const json1 = JSON.stringify(str)
        const str2 = JSON.parse(json1)
        const json2 = JSON.stringify(str2)
        const str3 = JSON.parse(json2)
        expect(str3).toEqual("test:dataset1")
        console.log(str3)

        expect(receivedData).toEqual([
            {
                "status": "success",
                "name": "dateset1",
                "scope": "test",
                "did_type": "Dataset",
                "bytes": 0,
                "length": 0,
            },
            {
                "status": "success",
                "name": "dataset2",
                "scope": "test",
                "did_type": "Dataset",
                "bytes": 0,
                "length": 0,
            },
            {
                "status": "success",
                "name": "dataset3",
                "scope": "test",
                "did_type": "Dataset",
                "bytes": 0,
                "length": 0,
            }
        ])
    })
})
