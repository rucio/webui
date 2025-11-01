import 'reflect-metadata';
import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port';
import { inject, injectable } from 'inversify';
import { PassThrough, Transform } from 'node:stream';
import { HTTPRequest, prepareRequestArgs } from '@/lib/sdk/http';
import { BytesToStringifiedJSONTransform, NewlineDelimittedDataParser } from '@/lib/sdk/stream-transformers';
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { webStreamToNodeStream } from '@/lib/infrastructure/adapters/streaming-adapter';

@injectable()
export default class StreamingGateway implements StreamGatewayOutputPort {
    constructor(@inject(GATEWAYS.ENV_CONFIG) private envConfigGateway: EnvConfigGatewayOutputPort) {}

    private convertChunkBytesToString = new Transform({
        transform(chunk, encoding, callback) {
            callback(null, chunk.toString());
        },
    });

    async getTextStream(request: HTTPRequest): Promise<PassThrough | Response> {
        const { url, requestArgs } = prepareRequestArgs(request);

        const response = await fetch(url, requestArgs);
        if (!response.ok || response.body === null) {
            return response;
        }
        const responseBody = response.body;
        const nodeStream = webStreamToNodeStream(responseBody);
        const textStream = new PassThrough();
        nodeStream.pipe(this.convertChunkBytesToString).pipe(textStream);
        return Promise.resolve(textStream);
    }

    async getJSONChunks(request: HTTPRequest, ndjson: boolean = false): Promise<{ type: 'response' | 'stream'; content: PassThrough | Response }> {
        const { url, requestArgs } = prepareRequestArgs(request);
        const response = await fetch(url, requestArgs);

        if (!response.ok || response.body === null) {
            return {
                type: 'response',
                content: response,
            };
        }

        const responseBody = response.body;
        const nodeStream = webStreamToNodeStream(responseBody);
        const jsonStream = new PassThrough();
        if (ndjson) {
            nodeStream.pipe(new NewlineDelimittedDataParser()).pipe(jsonStream);
        } else {
            nodeStream.pipe(new BytesToStringifiedJSONTransform({ objectMode: true })).pipe(jsonStream);
        }
        return Promise.resolve({
            type: 'stream',
            content: jsonStream,
        });
    }
}
