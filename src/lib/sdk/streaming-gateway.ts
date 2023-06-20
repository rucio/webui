import 'reflect-metadata'
import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port'
import { injectable } from 'inversify'
import fetch, { Response } from 'node-fetch'
import { PassThrough, Transform } from 'node:stream'
import { HTTPRequest, prepareRequestArgs } from '@/lib/common/http'
import { BytesToStringifiedJSONTransform, NewlineDelimittedDataParser } from '@/lib/sdk/stream-transformers'
@injectable()
export default class StreamingGateway<T> implements StreamGatewayOutputPort {
    private convertChunkBytesToString = new Transform({
        transform(chunk, encoding, callback) {
            callback(null, chunk.toString())
        },
    })

    async getTextStream(request: HTTPRequest): Promise<PassThrough | Response> {
        const { url, requestArgs } = prepareRequestArgs(request)
        
        const response = await fetch(url, requestArgs)
        if (!response.ok || response.body === null) {
            return response
        }
        const responseBody = response.body
        const textStream = new PassThrough()
        responseBody.pipe(this.convertChunkBytesToString).pipe(textStream)
        return Promise.resolve(textStream)
    }

    async getJSONChunks(request: HTTPRequest, ndjson: boolean = false): Promise<PassThrough | Response> {
        const { url, requestArgs } = prepareRequestArgs(request)
        const response = await fetch(url, requestArgs)

        if (!response.ok || response.body === null) {
            return response
        }

        const responseBody = response.body
        const jsonStream = new PassThrough()
        if(ndjson) {
            responseBody
                .pipe(new NewlineDelimittedDataParser())
                .pipe(jsonStream)
        } else {
            responseBody
                .pipe(new BytesToStringifiedJSONTransform({ objectMode: true }))
                .pipe(jsonStream)
        }
        return Promise.resolve(jsonStream)
    }
}
