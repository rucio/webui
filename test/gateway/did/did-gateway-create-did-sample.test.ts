import { CreateDIDSampleDTO } from "@/lib/core/dto/did-dto"
import DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port"
import appContainer from "@/lib/infrastructure/ioc/container-config"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server"

describe('DID Gateway Tests Create DID Sample', () => {
    beforeEach(() => {
        fetchMock.doMock()
        const createDIDSampleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/sample`,
            method: 'POST',
            response: {
                status: 201,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: 'Created'
            }
        }
        MockRucioServerFactory.createMockRucioServer(true, [createDIDSampleEndpoint]);
    })

    afterEach(() => {
        fetchMock.dontMock()
    })
    
    it('should successfully create DID Sample', async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(
            GATEWAYS.DID,
        )
        const dto: CreateDIDSampleDTO = await rucioDIDGateway.createDIDSample(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'test',
            'dataset1',
            'test',
            'dataset10',
            2
        )
        expect(dto.status).toEqual('success')
        expect(dto.created).toEqual(true)

    })
})