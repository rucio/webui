import 'reflect-metadata'
import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port'
import { injectable } from 'inversify'
import fetch from 'node-fetch'
import { PassThrough, Transform } from 'node:stream'
import { TransformCallback } from 'stream'
import 'ndjson'

class BytesToStringifiedJSONTransform extends Transform {
    buffer: string[]

    /**
     * The mode of the stream. Can be 'object', 'array' or false if the mode is not yet known
     */
    mode: 'object' | 'array' | false

    constructor(options: any) {
        super(options)
        this.buffer = []
        this.mode = false
    }
    /**
     *
     * @returns The contents of the buffer as a string
     */
    readBuffer() {
        return this.buffer.join('')
    }

    /**
     * Validate the buffer
     * @returns True if the buffer contains a valid JSON object or array. Otherwise returns false
     * @throws Error if the buffer contains an invalid JSON object or array
     * */
    validateBuffer() {
        const bufferData = this.readBuffer()
        return bufferData.startsWith('{')
    }

    clearBuffer() {
        this.buffer = []
    }

    pushToBuffer(chunk: string) {
        if (this.readBuffer().length === 0) {
            if (!chunk.startsWith('{')) {
                chunk = chunk.substring(chunk.indexOf('{'))
            }
        }
        this.buffer.push(chunk)
    }
    /**
     * Gets the largest JSON object available in the buffer. If found, removes this object from the buffer.
     * @returns The last object in the buffer if the buffer contains a valid JSON object. Otherwise returns null
     */
    extractLargestJSONObject(): string | null {
        const bufferData = this.readBuffer()
        if (!this.validateBuffer()) {
            return null
        }
        // parse the buffer character by character and count the number of open and closed brackets
        let numOfOpenBrackets = 1
        let numOfClosedBrackets = 0
        for (let i = 1; i < bufferData.length; i++) {
            const char = bufferData[i]
            if (char === '{') {
                numOfOpenBrackets++
            } else if (char === '}') {
                numOfClosedBrackets++
            }
            if (numOfClosedBrackets === numOfOpenBrackets) {
                const lastObjectIndex = bufferData.lastIndexOf('}')
                const lastObject = bufferData.slice(0, lastObjectIndex + 1)
                if (bufferData[lastObjectIndex + 1] === ','|| bufferData[lastObjectIndex + 1] === '\n') {
                    this.buffer = [bufferData.slice(lastObjectIndex + 2)]
                } else {
                    this.buffer = [bufferData.slice(lastObjectIndex + 1)]
                }
                return lastObject
            }
        }
        return null
    }

    /**
     * Converts a JSON string to a DTO
     * @param json The JSON string to convert
     * @returns The DTO
     * @throws Error if the JSON string could not be converted to a DTO
     **/
    convertJSONObjectToDTO(json: string): Object {
        try {
            const jsonObject = JSON.parse(json)
            return jsonObject as Object
        } catch (error) {
            throw new Error(`Could not convert JSON ${json} to DTO: ${error}`)
        }
    }

    /**
     * Sets streaming mode to object or array
     * @param firstChunk the first chunk of the stream
     * @returns The first chunk without the first character if it was an array
     */
    setMode(firstChunk: string): string {
        let modifiedFirstChunk = firstChunk
        if (firstChunk.startsWith('[')) {
            this.mode = 'array'
            modifiedFirstChunk = firstChunk.slice(1)
        } else {
            this.mode = 'object'
        }
        return modifiedFirstChunk
    }

    _transform(
        chunkBytes: Uint16Array,
        encoding: string,
        callback: (error?: Error | null, data?: any) => void,
    ) {
        const chunk = chunkBytes.toString()
        if (!this.mode) {
            const firstChunk = this.setMode(chunk)
            this.buffer.push(firstChunk)
        } else {
            this.buffer.push(chunk)
        }

        try {
            const jsonObject = this.extractLargestJSONObject()
            if (jsonObject === null) {
                callback(null)
                return
            }
            callback(null, jsonObject)
        } catch (error) {
            callback(null)
        }
    }

    _flush(callback: TransformCallback): void {
        const bufferData = this.readBuffer()
        if (this.mode === 'array') {
            if (bufferData.endsWith(']')) {
                this.buffer = [bufferData.slice(0, -1)]
            } else {
                // TODO this should be an error
                this.buffer = [bufferData]
            }
        }
        if (this.buffer.length > 1) {
            try {
                const dto = this.convertJSONObjectToDTO(this.readBuffer())
                this.clearBuffer()
                callback(null, JSON.stringify(dto))
            } catch (error: any) {
                callback(error as Error)
            }
        } else {
            callback(null)
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
            // .pipe(ndjson.parse())
            .pipe(new BytesToStringifiedJSONTransform({ objectMode: true }))
            .pipe(jsonStream)
        return Promise.resolve(jsonStream)
    }
}
