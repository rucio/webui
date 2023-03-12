import StreamGatewayOutputPort from "@/lib/core/port/secondary/stream-gateway-output-port";
import { injectable } from "inversify";
import fetch from "node-fetch";
import { PassThrough } from "node:stream";

@injectable()
export default class StreamingGateway<T> implements StreamGatewayOutputPort {
    host: string
    url: string

    constructor() {
        this.host = 'http://localhost:8080'
        this.url = `${this.host}/stream`
    }

    async getTextStream(): Promise<PassThrough | null> {
        const response = await fetch(this.url, {
            method: 'GET',
        })
        if(!response.ok || response.body === null) {
            throw new Error(`Failed to fetch stream: ${response.statusText}`);
        }
        const responseBody = response.body

        return Promise.resolve(
            responseBody
        )
        
    }
    getJSONStream(): ReadableStream {
        throw new Error("Method not implemented.");
    }
    getDataStream(): ReadableStream {
        throw new Error("Method not implemented.");
    }

}
