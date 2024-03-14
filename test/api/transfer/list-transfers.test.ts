import { ListTransfersRequest } from '@/lib/core/usecase-models/list-transfers-usecase-models'
import { ListTransfersControllerParameters } from '@/lib/infrastructure/controller/list-transfers-controller'
import appContainer from '@/lib/infrastructure/ioc/container-config'
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers'
import { BaseController } from '@/lib/sdk/controller'
import { NextApiResponse } from 'next'
import { Readable } from 'stream'
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures'
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server'

describe('List Transfers Feature tests', () => {
    beforeEach(() => {
        fetchMock.doMock()
        const transferStream = Readable.from([
            JSON.stringify({
                id: 'dummy_transfer_1',
                request_type: 'T',
                scope: 'test',
                name: 'file1',
                did_type: 'File',
                attributes: '',
                retry_count: 0,
                rule_id: 'rule1',
                bytes: 500000,
                activity: 'Rebalance',
                state: 'S',
                source_rse_id: '59fcad356a68434cbe8c43737ccb3f83',
                dest_rse_id: '328c926f09ea4dc0a5ddfbe62c8e3bd5',
                source_rse: 'SWIFT',
                dest_rse: 'AMAZON-BOTO',
                transfertool: 'fts',
                priority: 10,
                account: 'root',
                requested_at: 'Sat, 11 Nov 2023 06:00:00 UTC',
                submitted_at: 'Sat, 11 Nov 2023 06:00:10 UTC',
                started_at: 'Sat, 11 Nov 2023 06:00:15 UTC',
                transferred_at: null,
            }),
            JSON.stringify({
                id: 'dummy_transfer_2',
                request_type: 'T',
                scope: 'test',
                name: 'file2',
                did_type: 'File',
                attributes: '',
                retry_count: 0,
                rule_id: 'rule1',
                bytes: 500000,
                activity: 'Rebalance',
                state: 'S',
                source_rse_id: '59fcad356a68434cbe8c43737ccb3f83',
                dest_rse_id: '328c926f09ea4dc0a5ddfbe62c8e3bd5',
                source_rse: 'SWIFT',
                dest_rse: 'AMAZON-BOTO',
                transfertool: 'fts',
                priority: 10,
                account: 'root',
                requested_at: 'Sat, 11 Nov 2023 06:00:01 UTC',
                submitted_at: 'Sat, 11 Nov 2023 06:00:10 UTC',
                started_at: 'Sat, 11 Nov 2023 06:00:15 UTC',
                transferred_at: null,
            }),
            JSON.stringify({
                id: 'dummy_transfer_3',
                request_type: 'T',
                scope: 'test',
                name: 'file3',
                did_type: 'File',
                attributes: '',
                retry_count: 0,
                rule_id: 'rule1',
                bytes: 1000000,
                activity: 'Rebalance',
                state: 'S',
                source_rse_id: '59fcad356a68434cbe8c43737ccb3f83',
                dest_rse_id: '328c926f09ea4dc0a5ddfbe62c8e3bd5',
                source_rse: 'SWIFT',
                dest_rse: 'AMAZON-BOTO',
                transfertool: 'fts',
                priority: 10,
                account: 'root',
                requested_at: 'Sat, 11 Nov 2023 06:00:02 UTC',
                submitted_at: 'Sat, 11 Nov 2023 06:00:10 UTC',
                started_at: 'Sat, 11 Nov 2023 06:00:15 UTC',
                transferred_at: null,
            }),
        ].join('\n'))

        const listTransfersEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/requests/list?src_rse=SWIFT&dest_rse=AMAZON-BOTO`,
            method: 'GET',
            includes: 'requests/list?src_rse=SWIFT&dest_rse=AMAZON-BOTO',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: transferStream,
            },
        }

        MockRucioServerFactory.createMockRucioServer(true, [listTransfersEndpoint])
    })

    afterEach(() => {
        fetchMock.dontMock()
    })

    it('should list transfers as a stream', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()
        const controller = appContainer.get<
            BaseController<ListTransfersControllerParameters, ListTransfersRequest>
        >(CONTROLLERS.LIST_TRANSFERS)
        const controllerParams: ListTransfersControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            sourceRSE: 'SWIFT',
            destRSE: 'AMAZON-BOTO',
        }

        await controller.execute(controllerParams)

        const receivedData: any[] = []
        const onData = (data: any) => {
            receivedData.push(JSON.parse(data))
        }

        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData)
            res.on('end', () => {
                res.off('daat', onData)
                resolve()
            })
            res.on('error', err => {
                res.off('data', onData)
                reject(err)
            })
        })

        await done

        expect(receivedData.length).toEqual(3)
        receivedData.forEach((d) => {
            expect(d.source_rse).toEqual(controllerParams.sourceRSE)
            expect(d.dest_rse).toEqual(controllerParams.destRSE)
        })
    })
})