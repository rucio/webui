import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port'
import appContainer from '@/lib/infrastructure/config/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/config/ioc/ioc-symbols-gateway'
import { createMocks } from 'node-mocks-http'
import { PassThrough } from 'node:stream'

describe('Streaming tests for JSON encoded text payloads', () => {
    beforeEach(async () => {
        fetchMock.mockIf(/^http:\/\/localhost:8080\/stream/, async (req) => {
            if (req.method === 'GET') {
                const stream = new PassThrough()
                stream.write('Hello')
                stream.write('World')
                stream.end()
                return Promise.resolve({
                    status: 200,
                    body: stream,
                })
            }
        })
        // uncomment the line below to fetch data directly from a running mock server
        // fetchMock.dontMock()
    }, 10000 * 60 * 5)

    it('should return the mocked responses', async () => {
        const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
        const responseBody: PassThrough | null = await streamingGateway.getTextStream()
        expect(responseBody).not.toBeNull()
        // if response is null fail the test
        if(responseBody === null) {
            fail('response is null')
        }
        let chunks = []
        responseBody.on('data', (chunk) => {
            chunks.push(chunk.toString())
        })
        responseBody.on('end', () => {
            // console.log(chunks)
            expect(chunks.join('')).toEqual('HelloWorld')
        })

    })
})
