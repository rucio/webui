import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port'
import appContainer from '@/lib/infrastructure/config/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/config/ioc/ioc-symbols-gateway'
import { createMocks } from 'node-mocks-http'
import { PassThrough } from 'node:stream'

afterAll(() => {
    if (!process.stdout.write('')) {
        process.stdout.once('drain', () => { });
    }
});

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
    })

    it('should return the mocked chunks as text', async () => {
        const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
        const textStream: PassThrough | null = await streamingGateway.getTextStream()
        expect(textStream).not.toBeNull()
        // if response is null fail the test
        if(textStream === null) {
            fail('response is null')
        }
        let chunks:string[] = []
        const outputStream = new PassThrough()
        textStream.pipe(outputStream)

        outputStream.on('data', (chunk) => {
            chunks.push(chunk.toString())
        })
        outputStream.on('end', async () => {
            expect(chunks).toEqual(['Hello', 'World'])
        })
        while(outputStream.readableLength > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        await console.log(chunks)
    })
})
