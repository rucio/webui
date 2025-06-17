import 'reflect-metadata';
import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port';
import { inject, injectable } from 'inversify';
import fetch, { Response } from 'node-fetch';
import { PassThrough, Transform } from 'node:stream';
import { HTTPRequest, prepareRequestArgs } from '@/lib/sdk/http';
import { BytesToStringifiedJSONTransform, NewlineDelimittedDataParser } from '@/lib/sdk/stream-transformers';
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';

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
        const textStream = new PassThrough();
        responseBody.pipe(this.convertChunkBytesToString).pipe(textStream);
        return Promise.resolve(textStream);
    }

    async getJSONChunks(request: HTTPRequest, ndjson: boolean = false): Promise<{ type: 'response' | 'stream'; content: PassThrough | Response }> {
        const encodeParams = await this.envConfigGateway.paramsEncodingEnabled();
        const { url, requestArgs } = prepareRequestArgs(request, encodeParams);
        const response = await fetch(url, requestArgs);

        if (!response.ok || response.body === null) {
            return {
                type: 'response',
                content: response,
            };
        }

        const responseBody = response.body;
        const jsonStream = new PassThrough();
        if (ndjson) {
            responseBody.pipe(new NewlineDelimittedDataParser()).pipe(jsonStream);
        } else {
            responseBody.pipe(new BytesToStringifiedJSONTransform({ objectMode: true })).pipe(jsonStream);
        }
        return Promise.resolve({
            type: 'stream',
            content: jsonStream,
        });
    }
}
