import { Transform, TransformCallback } from 'stream';

/**
 * A transform stream that parses newline-delimited JSON data.
 */
export class NewlineDelimittedDataParser extends Transform {
    /**
     * The buffer that holds the incoming data.
     */
    buffer: string;

    /**
     * Creates a new instance of the `NewlineDelimittedDataParser` class.
     */
    constructor() {
        super({ objectMode: true });
        this.buffer = '';
    }

    /**
     * Returns the contents of the buffer.
     * @returns The contents of the buffer.
     */
    readBuffer(): string {
        return this.buffer;
    }

    /**
     * Clears the buffer.
     */
    clearBuffer(): void {
        this.buffer = '';
    }

    /**
     * Appends the given chunk to the buffer.
     * @param chunk - The chunk to append to the buffer.
     */
    pushToBuffer(chunk: string): void {
        this.buffer += chunk;
    }

    /**
     * Pushes the given chunk to the next stream in the pipeline.
     * @param chunk - The chunk to push to the next stream.
     */
    pushToNextStream(chunk: string): void {
        try {
            // Check whether the chunk is a valid JSON string
            JSON.parse(chunk);
            this.push(JSON.stringify(chunk));
        } catch (_) {
            // Don't push an invalid chunk
        }
    }

    /**
     * Extracts the JSON objects from the buffer.
     * @returns An array of JSON objects.
     */
    extractJSONObjects(): string[] {
        const bufferData = this.readBuffer();
        const objects = bufferData.split('\n').filter(object => object.length > 0);

        if (objects.length === 0) {
            return [];
        }

        if (objects.length === 1) {
            const object = objects[0];
            if (bufferData.endsWith('\n')) {
                this.clearBuffer();
                return [object];
            } else {
                return [];
            }
        }

        if (bufferData.endsWith('\n')) {
            this.clearBuffer();
            return objects;
        } else {
            const lastObject = objects[objects.length - 1];
            this.clearBuffer();
            this.pushToBuffer(lastObject);
            return objects.slice(0, objects.length - 1);
        }
    }

    /**
     * Transforms the incoming chunk of data.
     * @param chunk - The incoming chunk of data.
     * @param encoding - The encoding of the incoming chunk of data.
     * @param callback - The callback function to call when the transformation is complete.
     */
    _transform(chunk: any, encoding: string, callback: TransformCallback) {
        const data = chunk.toString();
        this.pushToBuffer(data);
        try {
            const objects = this.extractJSONObjects();
            for (const object of objects) {
                this.pushToNextStream(object);
            }
            callback();
        } catch (error) {
            this.emit('error', error);
            callback();
        }
    }

    /**
     * Flushes any remaining data in the buffer.
     * @param callback - The callback function to call when the flushing is complete.
     */
    _flush(callback: TransformCallback) {
        if (this.readBuffer().length === 0) {
            callback();
            return;
        }
        const objects = this.readBuffer().split('\n');
        try {
            for (const object of objects) {
                this.pushToNextStream(object);
            }
            callback();
        } catch (error) {
            this.emit('error', error);
            callback();
        }
    }
}

/**
 * A transform stream that converts incoming bytes to stringified JSON objects.
 */
export class BytesToStringifiedJSONTransform extends Transform {
    buffer: string[];

    /**
     * The mode of the stream. Can be 'object', 'array' or false if the mode is not yet known
     */
    mode: 'object' | 'array' | false;

    constructor(options: any) {
        super(options);
        this.buffer = [];
        this.mode = false;
    }
    /**
     *
     * @returns The contents of the buffer as a string
     */
    readBuffer() {
        return this.buffer.join('');
    }

    /**
     * Validate the buffer
     * @returns True if the buffer contains a valid JSON object or array. Otherwise returns false
     * @throws Error if the buffer contains an invalid JSON object or array
     * */
    validateBuffer() {
        const bufferData = this.readBuffer();
        return bufferData.startsWith('{');
    }

    clearBuffer() {
        this.buffer = [];
    }

    pushToBuffer(chunk: string) {
        if (this.readBuffer().length === 0) {
            if (!chunk.startsWith('{')) {
                chunk = chunk.substring(chunk.indexOf('{'));
            }
        }
        this.buffer.push(chunk);
    }
    /**
     * Gets the largest JSON object available in the buffer. If found, removes this object from the buffer.
     * @returns The last object in the buffer if the buffer contains a valid JSON object. Otherwise returns null
     */
    extractLargestJSONObject(): string | null {
        const bufferData = this.readBuffer();
        if (!this.validateBuffer()) {
            return null;
        }
        // parse the buffer character by character and count the number of open and closed brackets
        let numOfOpenBrackets = 1;
        let numOfClosedBrackets = 0;
        for (let i = 1; i < bufferData.length; i++) {
            const char = bufferData[i];
            if (char === '{') {
                numOfOpenBrackets++;
            } else if (char === '}') {
                numOfClosedBrackets++;
            }
            if (numOfClosedBrackets === numOfOpenBrackets) {
                const lastObjectIndex = bufferData.lastIndexOf('}');
                const lastObject = bufferData.slice(0, lastObjectIndex + 1);
                if (bufferData[lastObjectIndex + 1] === ',' || bufferData[lastObjectIndex + 1] === '\n') {
                    this.buffer = [bufferData.slice(lastObjectIndex + 2)];
                } else {
                    this.buffer = [bufferData.slice(lastObjectIndex + 1)];
                }
                return lastObject;
            }
        }
        return null;
    }

    /**
     * Converts a JSON string to a DTO
     * @param json The JSON string to convert
     * @returns The DTO
     * @throws Error if the JSON string could not be converted to a DTO
     **/
    convertJSONObjectToDTO(json: string): Object {
        try {
            const jsonObject = JSON.parse(json);
            return jsonObject as Object;
        } catch (error) {
            this.emit('error', `Could not convert JSON ${json} to DTO: ${error}`);
            throw error;
        }
    }

    /**
     * Sets streaming mode to object or array
     * @param firstChunk the first chunk of the stream
     * @returns The first chunk without the first character if it was an array
     */
    setMode(firstChunk: string): string {
        let modifiedFirstChunk = firstChunk;
        if (firstChunk.startsWith('[')) {
            this.mode = 'array';
            modifiedFirstChunk = firstChunk.slice(1);
        } else {
            this.mode = 'object';
        }
        return modifiedFirstChunk;
    }

    _transform(chunkBytes: Uint16Array, encoding: string, callback: (error?: Error | null, data?: any) => void) {
        const chunk = chunkBytes.toString();
        if (!this.mode) {
            const firstChunk = this.setMode(chunk);
            this.buffer.push(firstChunk);
        } else {
            this.buffer.push(chunk);
        }

        try {
            const jsonObject = this.extractLargestJSONObject();
            if (jsonObject === null) {
                callback(null);
                return;
            }
            callback(null, jsonObject);
        } catch (error) {
            this.emit('error', error);
            callback(null);
        }
    }

    _flush(callback: TransformCallback): void {
        const bufferData = this.readBuffer();
        if (this.mode === 'array') {
            if (bufferData.endsWith(']')) {
                this.buffer = [bufferData.slice(0, -1)];
            } else {
                // TODO this should be an error
                this.buffer = [bufferData];
            }
        }
        if (this.buffer.length > 1) {
            try {
                const dto = this.convertJSONObjectToDTO(this.readBuffer());
                this.clearBuffer();
                callback(null, JSON.stringify(dto));
            } catch (error: any) {
                this.emit('error', error);
                callback(error as Error);
            }
        } else {
            callback(null);
        }
    }
}
