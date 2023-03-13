import { PassThrough } from 'node:stream';

export default interface StreamGatewayOutputPort {
    getTextStream(url: string): Promise<PassThrough | null>;
    getJSONChunks(url: string): Promise<PassThrough | null>;
}