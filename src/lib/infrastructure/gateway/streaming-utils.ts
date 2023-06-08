import { Transform } from 'stream'

export class NewlineDelimittedDataParser extends Transform {
    buffer: string

    constructor() {
        super({ objectMode: true })
        this.buffer = ''
    }

    readBuffer() {
        return this.buffer
    }

    clearBuffer() {
        this.buffer = ''
    }

    pushToBuffer(chunk: string) {
        this.buffer += chunk
    }

    extractJSONObjects(): string[] {
        const bufferData = this.readBuffer()
        const objects = bufferData.split('\n').filter((object) => object.length > 0)
        if (objects.length === 0) {
            return []
        }
        if(objects.length === 1) {
            const object = objects[0]
            this.clearBuffer()
            return [object]
        }
        const lastObject = objects[objects.length - 1]
        this.clearBuffer()
        this.pushToBuffer(lastObject)
        return objects.slice(0, objects.length - 1)
    }

    _transform(chunk: any, encoding: string, callback: Function) {
        const data = chunk.toString()
        this.pushToBuffer(data)
        try {
            const objects = this.extractJSONObjects()
            for (const object of objects) {
                this.push(JSON.stringify(object))
            }
            callback(null)
        } catch (error) {
            callback(null)
        }
    }

    _flush(callback: Function) {
        const objects = this.readBuffer().split('\n')
        for (const object of objects) {
            this.push(object)
        }
        callback(null)
    }
}
