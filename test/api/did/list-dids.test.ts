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
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dids/search`,
            method: 'GET',
            includes: 'test/dids/search',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(
                    [
                        '"dataset1"\n',
                        '"dataset2"\n',
                        '"dataset3"\n',
                    ].join('\n'),
                ),
            },
        }

        const dataset1StatusEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset1/status?dynamic_depth=FILE`,
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
                    length: 0,
                    bytes: 0,
                }),
            },
        }

        const dataset2StatusEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset2/status?dynamic_depth=FILE`,
            method: 'GET',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scope: 'test',
                    name: 'dataset2',
                    type: 'DATASET',
                    account: 'root',
                    open: true,
                    monotonic: false,
                    expired_at: null,
                    bytes: 123,
                    length: 456,
                }),
            },
        }

        const dataset3StatusEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset3/status?dynamic_depth=FILE`,
            method: 'GET',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scope: 'test',
                    name: 'dataset3',
                    type: 'DATASET',
                    account: 'root',
                    open: true,
                    monotonic: false,
                    expired_at: null,
                    bytes: 456,
                    length: 789,
                }),
            },
        }

        MockRucioServerFactory.createMockRucioServer(true, [
            listDIDsEndpoint,
            dataset1StatusEndpoint,
            dataset2StatusEndpoint,
            dataset3StatusEndpoint,
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


        expect(receivedData).toEqual([
            {
                "status": "success",
                "name": "dataset1",
                "scope": "test",
                "did_type": "Dataset",
                "bytes": 0,
                "length": 0,
                "open": true,
            },
            {
                "status": "success",
                "name": "dataset2",
                "scope": "test",
                "did_type": "Dataset",
                "bytes": 123,
                "length": 456,
                "open": true,
            },
            {
                "status": "success",
                "name": "dataset3",
                "scope": "test",
                "did_type": "Dataset",
                "bytes": 456,
                "length": 789,
                "open": true,
            }
        ])
    })
})
