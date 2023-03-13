import 'reflect-metadata'
import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port'
import { injectable } from 'inversify'
import fetch from 'node-fetch'
import { PassThrough, Transform } from 'node:stream'
import { TransformCallback } from 'stream'

class BytesToStringifiedJSONTransform extends Transform {
    buffer: string[]
    constructor(options: any) {
        super(options)
        this.buffer = []
    }
    readBuffer() {
        return this.buffer.join('')
    }
    clearBuffer() {
        this.buffer = []
    }

    _transform(
        chunk: string,
        encoding: string,
        callback: (error?: Error | null, data?: any) => void,
    ) {
        this.buffer.push(chunk.toString())
        try {
            const jsonObject = JSON.parse(this.readBuffer())
            this.clearBuffer()
            callback(null, JSON.stringify(jsonObject))
        } catch (error) {
            callback(null, null)
        }
    }

    _flush(callback: TransformCallback): void {
        if (this.buffer.length > 0) {
            try {
                const jsonObject = JSON.parse(this.readBuffer())
                this.clearBuffer()
                callback(null, JSON.stringify(jsonObject))
            } catch (error: any) {
                callback(error as Error, null)
            }
        }else {
            callback(null, null)
        }
    }
}
@injectable()
export default class StreamingGateway<T> implements StreamGatewayOutputPort {
    private convertChunkBytesToString = new Transform({
        transform(chunk, encoding, callback) {
            callback(null, chunk.toString())
        },
    })

    
    async getTextStream(url: string): Promise<PassThrough | null> {
        const response = await fetch(url, {
            method: 'GET',
        })
        if (!response.ok || response.body === null) {
            throw new Error(`Failed to fetch stream: ${response.statusText}`)
        }
        const responseBody = response.body
        const textStream = new PassThrough()
        responseBody.pipe(this.convertChunkBytesToString).pipe(textStream)
        return Promise.resolve(textStream)
    }

    async getJSONChunks(url: string): Promise<PassThrough | null> {
        const response = await fetch(url, {
            method: 'GET',
        })
        if (!response.ok || response.body === null) {
            throw new Error(`Failed to fetch stream: ${response.statusText}`)
        }
        const responseBody = response.body
        const jsonStream = new PassThrough()
        responseBody
            .pipe(new BytesToStringifiedJSONTransform({ objectMode: true }))
            .pipe(jsonStream)
        return Promise.resolve(jsonStream)
    }
}
