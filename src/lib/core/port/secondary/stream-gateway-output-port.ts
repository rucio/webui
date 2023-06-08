import { HTTPRequest } from "@/lib/common/stream/http"
import { Response } from "node-fetch";
import { PassThrough } from 'node:stream';

export default interface StreamGatewayOutputPort {
    getTextStream(request: HTTPRequest): Promise<PassThrough | Response >;
    getJSONChunks(request: HTTPRequest, ndjson: boolean): Promise<PassThrough | Response >;
}