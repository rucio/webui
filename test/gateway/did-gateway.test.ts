import { ListDIDDTO, DIDDTO } from '@/lib/core/data/did-dto'
import { DIDType } from '@/lib/core/entity/rucio'
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port'
import appContainer from '@/lib/infrastructure/config/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/config/ioc/ioc-symbols-gateway'
import { PassThrough } from 'node:stream'
import { Readable } from 'stream'

describe('DID Gateway Tests', () => {
    beforeEach(() => {
        fetchMock.doMock()
        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, req => {
            const rucioToken = req.headers.get('X-Rucio-Auth-Token')
            if (rucioToken !== 'rucio-ddmlab-askdjljioj') {
                return Promise.resolve({
                    status: 401,
                })
            }
            if (req.url.includes('/mc16_13TeV/dids/search')) {
                const stream = Readable.from(
                    [
                        'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
                        'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01',
                        'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02',
                    ].join('\n'),
                )
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/x-json-stream',
                    },
                    body: stream,
                })
            }
            if (req.url.endsWith('/test/dataset1/status')){
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "scope": "test",
                        "name": "dataset1",
                        "type": "DATASET",
                        "account": "root",
                        "open": true,
                        "monotonic": false,
                        "expired_at": null,
                        "length": null,
                        "bytes": null
                    })
                })
            }
        })
    })
    afterEach(() => {
        fetchMock.dontMock()
    })

    it('should successfully stream DIDs from Newline-Delimitted String to String Array', async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(
            GATEWAYS.DID,
        )
        const didDTO: ListDIDDTO = await rucioDIDGateway.listDIDs(
            'rucio-ddmlab-askdjljioj',
            'mc16_13TeV',
            'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
            DIDType.DATASET,
        )
        expect(didDTO.status).toBe('success')
        const didStream: PassThrough | null = didDTO.stream
        if (!didStream) {
            fail('Stream is not defined')
        }

        const receivedData: any[] = []
        const onData = (data: any) => {
            receivedData.push(JSON.parse(data.toString()))
        }
        await new Promise<void>((resolve, reject) => {
            didStream.on('data', onData)
            didStream.on('end', () => {
                console.log('end')
                didStream.off('data', onData)
                resolve()
            })
            didStream.on('error', err => {
                didStream.off('data', onData)
                reject(err)
            })
        })

        expect(receivedData).toEqual([
            'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
            'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01',
            'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02',
        ])
    })

    it("Should fetch DID's status", async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(
            GATEWAYS.DID,
        )
        const didDTO = await rucioDIDGateway.getDID(
            'rucio-ddmlab-askdjljioj',
            'test',
            'dataset1',
        )
        expect(didDTO.status).toBe('success')
        expect(didDTO.error).toBeNull()
        expect(didDTO.account).toBe('root')
        expect(didDTO.open).toBe(true)
        expect(didDTO.monotonic).toBe(false)
        expect(didDTO.expired_at).toBeNull()
    })
})
