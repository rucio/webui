import { RSEType } from '@/lib/core/entity/rucio'
import { ListRSEsRequest } from '@/lib/core/usecase-models/list-rses-usecase-models'
import { ListRSEsControllerParameters } from '@/lib/infrastructure/controller/list-rses-controller'
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
        const rseStream = Readable.from([JSON.stringify({ rse: 'XRD1' })].join('\n'))

        const xrd1 = JSON.stringify({
            availability_delete: true,
            availability_read: true,
            availability_write: true,
            deterministic: true,
            domain: ['lan', 'wan'],
            id: '464cd7656db842c78261bcc2a087bbcb',
            lfn2pfn_algorithm: 'hash',
            protocols: [
                {
                    hostname: 'xrd1',
                    scheme: 'root',
                    port: 1094,
                    prefix: '//rucio',
                    impl: 'rucio.rse.protocols.xrootd.Default',
                    domains: {
                        lan: {
                            read: 1,
                            write: 1,
                            delete: 1,
                        },
                        wan: {
                            read: 1,
                            write: 1,
                            delete: 1,
                            third_party_copy_read: 1,
                            third_party_copy_write: 1,
                        },
                    },
                    extended_attributes: null,
                },
            ],
            qos_class: null,
            rse: 'XRD1',
            rse_type: 'DISK',
            sign_url: null,
            staging_area: false,
            verify_checksum: true,
            volatile: false,
            read_protocol: 1,
            write_protocol: 1,
            delete_protocol: 1,
            third_party_copy_read_protocol: 1,
            third_party_copy_write_protocol: 1,
            availability: 7,
        })
        const listRSEsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses?expression=XRD1`,
            method: 'GET',
            includes: 'rses?expression=XRD1',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: rseStream,
            },
        }
        const getXRD1Endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/XRD1`,
            method: 'GET',
            includes: 'rses/XRD1',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: xrd1,
            },
        }
        MockRucioServerFactory.createMockRucioServer(true, [listRSEsEndpoint, getXRD1Endpoint])
    })

    afterEach(() => {
        fetchMock.dontMock()
    })

    it('should return with INVALID RSE EXPRESSION error if rseExpression is undefined', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()
        const controller = appContainer.get<
            BaseController<ListRSEsControllerParameters, ListRSEsRequest>
        >(CONTROLLERS.LIST_RSES)
        const controllerParams: ListRSEsControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            rseExpression: '',
        }

        await controller.execute(controllerParams)
        const data = await res._getJSONData()
        expect(data.status).toBe('error')
        expect(data.message).toBe('RSE Expression is undefined or an empty string')
    })
    it('should list rses as a stream', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()

        const controller = appContainer.get<
            BaseController<ListRSEsControllerParameters, ListRSEsRequest>
        >(CONTROLLERS.LIST_RSES)
        const controllerParams: ListRSEsControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            rseExpression: 'XRD1',
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
        expect(receivedData[0].id).toEqual('464cd7656db842c78261bcc2a087bbcb')
        expect(receivedData[0].rse_type).toEqual(RSEType.DISK)
    })
})
