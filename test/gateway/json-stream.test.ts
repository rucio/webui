import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port'
import appContainer from '@/lib/infrastructure/config/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/config/ioc/ioc-symbols-gateway'
import { createMocks } from 'node-mocks-http'
import { PassThrough } from 'node:stream'

describe('Streaming tests for JSON encoded text payloads', () => {
    beforeEach(() => {
        fetchMock.dontMock()
    })

    it('should return the mocked responses', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            url: 'http://localhost/stream',
        })

        const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
        const response: PassThrough | null = await streamingGateway.getTextStream()
        expect(response).not.toBeNull()
        // if response is null fail the test
        if(response === null) {
            fail('response is null')
        }
        response.on('data', (chunk) => {
            console.log(chunk.toString())
        })

    })
})
