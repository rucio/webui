import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';
import { PassThrough } from 'node:stream';

export default interface StreamGatewayOutputPort {
    getTextStream(request: HTTPRequest): Promise<PassThrough | Response>;
    getJSONChunks(request: HTTPRequest, ndjson?: boolean): Promise<{ type: 'response' | 'stream'; content: PassThrough | Response }>;
}
