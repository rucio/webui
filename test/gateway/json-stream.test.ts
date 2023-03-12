import JSONStream from '@/lib/infrastructure/gateway/streaming-utils'
import { createMocks } from 'node-mocks-http'
import { ReadableStream } from 'node:stream/web'


describe('Streaming tests for JSON encoded text payloads', () => {
    beforeEach(() => {
        fetchMock.doMock()
    })
    afterEach(() => {
        fetchMock.resetMocks()
    })
    it('should return a stream of JSON objects', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            body: {
            }
        });
        
        const textChunks = [
            '{"id": 1, "name": "file1"}',
            '{"id": 2, "name": "file2"}',
            '{"id": 3, "name": "file3"}',
        ]
        const textStream = new ReadableStream<string>({
            
            start(controller) {
                textChunks.forEach(chunk => {
                    controller.enqueue(chunk)
                })
                controller.close()
            },
        })
        
        // take the readable stream and convert it into a stream of JSON objects

        

        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, req => {
            if (req.url.endsWith('/did')) {
                
                return Promise.resolve({
                    status: 200,
                    body: textStream,
                })
            }
        })
        // fetchMock.once(textStream)
        // fetch('https://rucio-host.com/did').then(res => {
        //     console.log(res)
        // })
        const stream = new JSONStream('https://rucio-host.com/did', [])
        
        // for await (const chunk of stream) {
        //     console.log(chunk)
        // }
        
    } )
})
