import { PassThrough } from 'node:stream';

export default interface StreamGatewayOutputPort {
    getTextStream(): Promise<PassThrough | null>;

}