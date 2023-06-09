import { BaseController, IBaseController } from '@/lib/core/base-components/ports'
import { ListDIDsRequest } from '@/lib/core/data/usecase-models/list-dids-usecase-models'
import appContainer from '@/lib/infrastructure/config/ioc/container-config'
import CONTROLLERS from '@/lib/infrastructure/config/ioc/ioc-symbols-controllers'
import { IListDIDsController, ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller'
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
                        'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
                        'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01',
                        'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02',
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
        const listDIDsController = appContainer.get<BaseController<ListDIDsRequest, ListDIDsControllerParameters>>(
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
        const onData = (data: any) => {
            receivedData.push(JSON.parse(data.toString()))
        }

        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData)
            res.on('end', () => {
                console.log('end')
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
            'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
            'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01',
            'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02',
        ])
    })
})
