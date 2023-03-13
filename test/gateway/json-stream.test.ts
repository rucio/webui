import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port'
import appContainer from '@/lib/infrastructure/config/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/config/ioc/ioc-symbols-gateway'
import { PassThrough } from 'node:stream'

describe('Streaming tests for JSON encoded text payloads', () => {
    beforeEach(async () => {
        fetchMock.mockIf(/^http:\/\/localhost:8080\/.*/, async (req) => {
            if (req.url.endsWith('textstream') && req.method === 'GET') {
                const stream = new PassThrough()
                stream.write('Hello')
                stream.write('World')
                stream.end()
                return Promise.resolve({
                    status: 200,
                    body: stream,
                })
            }
            if (req.url.endsWith('goodjsonstream') && req.method === 'GET') {
                const stream = new PassThrough()
                stream.write('{"Hello":')
                stream.write('"World"}')
                stream.end()
                return Promise.resolve({
                    status: 200,
                    body: stream,
                })
            }
            if (req.url.endsWith('nestedjsonstream') && req.method === 'GET') {
                const stream = new PassThrough()
                stream.write('{"RSE":')
                stream.write('"World"}')
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
        const url = 'http://localhost:8080/textstream'
        const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
        const textStream: PassThrough | null = await streamingGateway.getTextStream(url)
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
        outputStream.on('end', () => {
            expect(chunks).toEqual(['Hello', 'World'])
        })
        while(outputStream.readableLength > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    })
    it('should return the mocked chunks as JSON', async () => {
        const url = 'http://localhost:8080/goodjsonstream'
        const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
        const jsonStream: PassThrough | null = await streamingGateway.getJSONChunks(url)
        expect(jsonStream).not.toBeNull()
        // if response is null fail the test
        if(jsonStream === null) {
            fail('response is null')
        }
        let chunks:string[] = []
        const outputStream = new PassThrough()
        jsonStream.pipe(outputStream)

        outputStream.on('data', (chunk) => {
            chunks.push(chunk.toString())
        })
        outputStream.on('end', () => {
            const json = JSON.parse(chunks.join(''))
            expect(json).toEqual({'Hello': 'World'})
        })
        while(outputStream.readableLength > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    })
})
