import { ListTransferStatsRequest } from '@/lib/core/usecase-models/list-transfer-stats-usecase-models'
import { ListTransferStatsControllerParameters } from '@/lib/infrastructure/controller/list-transfer-stats-controller'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers'
import { BaseController } from '@/lib/sdk/controller'
import { NextApiResponse } from 'next'
import { Readable } from 'stream'
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures'
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server'

describe('List Transfer Statistics Feature tests', () => {
    beforeEach(() => {
        fetchMock.doMock()
        const transferStatsStream = Readable.from([
            JSON.stringify({
                source_rse_id: '59fcad356a68434cbe8c43737ccb3f83',
                dest_rse_id: '328c926f09ea4dc0a5ddfbe62c8e3bd5',
                activity: 'Rebalance',
                state: 'S',
                source_rse: 'SWIFT',
                dest_rse: 'AMAZON-BOTO',
                account: 'root',
                counter: 3,
                bytes: 2000000,
            })
        ].join('\n'))

        const listTransferStatsEndpoint: MockEndpoint =  {
            url: `${MockRucioServerFactory.RUCIO_HOST}/requests/metrics`,
            method: 'GET',
            includes: 'requests/metrics',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: transferStatsStream,
            },
        }

        MockRucioServerFactory.createMockRucioServer(true, [listTransferStatsEndpoint])
    })
    afterEach(() => {
        fetchMock.dontMock()
    })
    it('should list transfer statistics as a stream', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()

        const controller = appContainer.get<
            BaseController<ListTransferStatsControllerParameters, ListTransferStatsRequest>
        >(CONTROLLERS.LIST_TRANSFER_STATS)
        const controllerParams: ListTransferStatsControllerParameters = {
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

        expect(receivedData.length).toEqual(1)
        expect(receivedData[0].state).toEqual('S')
    })
})