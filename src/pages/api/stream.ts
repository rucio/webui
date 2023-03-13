import { NextApiRequest, NextApiResponse } from "next";
import StreamGatewayOutputPort from "@/lib/core/port/secondary/stream-gateway-output-port";
import appContainer from "@/lib/infrastructure/config/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/config/ioc/ioc-symbols-gateway";
import { PassThrough } from "node:stream";
// TODO https://2ality.com/2022/06/web-streams-nodejs.html#kinds-of-streams
// TODO https://soshace.com/node-lessons-writable-res-stream/

const streamRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
    const url = 'http://localhost:8080/stream'
    const responseBody: PassThrough | null = await streamingGateway.getTextStream(url)
    responseBody?.pipe(res)
}

export default streamRoute;
