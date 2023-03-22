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
                const nestedObject = {
                    parent: {
                        child: {
                            grandchild: {
                                key1: 'Value1',
                                key2: 'Value2',
                            },
                        },
                    },
                }
                const json = JSON.stringify(nestedObject)
                const chunks = json.match(/.{1,10}/g) || []
                for (const chunk of chunks) {
                    stream.write(chunk)
                }
                stream.end()
                return Promise.resolve({
                    status: 200,
                    body: stream,
                })
            }
            if(req.url.endsWith('listofobjects')) {
                const stream = new PassThrough()
                const listOfObjects = []
                for(let i = 0; i < 10; i++) {
                    listOfObjects.push({
                        RSE: {
                            name: `RSE${i}`,
                            info: {
                                size: i * 100,
                            }
                        }
                    })
                }
                const json = JSON.stringify(listOfObjects)
                // split the json into chunks of 10 characters
                const chunks = json.match(/.{1,20}/g) || []
                for (const chunk of chunks) {
                    stream.write(chunk)
                }
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
        let chunks: any[] = []
        const outputStream = new PassThrough()
        jsonStream.pipe(outputStream)

        outputStream.on('data', (chunk) => {
            const data = chunk.toString()
            const jsonObject = JSON.parse(data)
            chunks.push(jsonObject)
        })
        outputStream.on('end', () => {
            expect('Hello' in chunks[0]).toEqual(true)
            expect(chunks[0].Hello).toEqual('World')
        })

        while(outputStream.readableLength > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    })

    it('should return nested json responses as JSON', async () => {
        const url = 'http://localhost:8080/nestedjsonstream'
        const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
        const jsonStream: PassThrough | null = await streamingGateway.getJSONChunks(url)
        expect(jsonStream).not.toBeNull()
        // if response is null fail the test
        if(jsonStream === null) {
            fail('response is null')
        }
        let chunks: Object[] = []
        const outputStream = new PassThrough()
        jsonStream.pipe(outputStream)

        outputStream.on('data', (chunk) => {
            const data = chunk.toString()
            const jsonObject = JSON.parse(data)
            chunks.push(jsonObject)
        })
        outputStream.on('end', () => {
            expect(chunks.length).toEqual(1)
            const json = chunks[0]
            expect(json).toEqual({
                parent: {
                    child: {
                        grandchild: {
                            key1: 'Value1',
                            key2: 'Value2',
                        },
                    },
                },
            })
        })
        while(outputStream.readableLength > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    })
    it('should return list of objects as JSON', async () => {
        const url = 'http://localhost:8080/listofobjects'
        const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
        const jsonStream: PassThrough | null = await streamingGateway.getJSONChunks(url)
        
        expect(jsonStream).not.toBeNull()
        // if response is null fail the test
        if(jsonStream === null) {
            fail('response is null')
        }
        let chunks:Object[] = []
        const outputStream = new PassThrough()
        jsonStream.pipe(outputStream)

        outputStream.on('data', (chunk: string) => {
            const data = chunk.toString()
            const jsonObject = JSON.parse(data)
            chunks.push(jsonObject)
        })
        outputStream.on('end', () => {
            const json = chunks
            expect(json.length).toEqual(10)
            expect(json[0]).toEqual({
                RSE: {
                    name: 'RSE0',
                    info: {
                        size: 0,
                    },
                }
            })
            expect(json[9]).toEqual({
                RSE: {
                    name: 'RSE9',
                    info: {
                        size: 900,
                    },
                }
            })
        })
    })
})
