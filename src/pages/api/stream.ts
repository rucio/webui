import { NextApiRequest, NextApiResponse } from "next";
import StreamGatewayOutputPort from "@/lib/core/port/secondary/stream-gateway-output-port";
import appContainer from "@/lib/infrastructure/config/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/config/ioc/ioc-symbols-gateway";
import { PassThrough } from "node:stream";
// TODO https://2ality.com/2022/06/web-streams-nodejs.html#kinds-of-streams
// TODO https://soshace.com/node-lessons-writable-res-stream/

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const streamRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM)
    const url = 'http://localhost:8080/stream'
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    const responseStream: PassThrough | null = await streamingGateway.getJSONChunks(url)
    let initialPayloadSent: boolean = false
    responseStream?.on('data', async (chunk) => {
        // console.log('chunk', chunk)
        if (!initialPayloadSent) {
            res.write('[')
            initialPayloadSent = true
        }
        res.write(chunk.toString() + '\n')
    })
    responseStream?.on('end', async () => {
        res.write(']')
        res.end()
    })
    for (let i = 0; i < 5; i++) {
        res.write(`data: Hello seq ${i}\n\n`);
        await sleep(1000);
      }
    res.end('done\n');
    // res.write(
    //     '{data: Hello}\n{data: World}\n\n'
    // )
    // res.end()
}

export default streamRoute;
