import { NextApiRequest, NextApiResponse } from "next";
import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util'
import fetch from 'node-fetch';
import StreamGatewayOutputPort from "@/lib/core/port/secondary/stream-gateway-output-port";
import appContainer from "@/lib/infrastructure/config/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/config/ioc/ioc-symbols-gateway";
import { PassThrough } from "node:stream";
// TODO https://2ality.com/2022/06/web-streams-nodejs.html#kinds-of-streams
// TODO https://soshace.com/node-lessons-writable-res-stream/

const streamRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
    const responseBody: PassThrough | null = await streamingGateway.getTextStream()
    responseBody?.pipe(res)
}

export default streamRoute;
