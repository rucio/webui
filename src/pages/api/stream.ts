import { NextApiRequest, NextApiResponse } from "next";
import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util'
import fetch from 'node-fetch';

// TODO https://2ality.com/2022/06/web-streams-nodejs.html#kinds-of-streams
// TODO https://soshace.com/node-lessons-writable-res-stream/

const streamRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    const externalResponse = await fetch("http://localhost:5000/stream")
    const readableStream = externalResponse.body;
    readableStream.pipe(res);
    res.write("Hello World");
    // async streaming example: Works
    // try {
    //     res.writeHead(200, {
    //         'Content-Type': 'text/plain',
    //         'Transfer-Encoding': 'chunked'
    //     })
    //     res.flushHeaders()
    //     for await (const chunk of externalResponse.body) {
    //         let data = chunk.toString();
    //         if(res.writable) {
    //             res.cork()
    //             res.write(data)
    //             process.nextTick(() => res.uncork())
    //             res.end();
    //             // sleep for 0.2 seconds to simulate slow streaming
    //             await new Promise(resolve => setTimeout(resolve, 2000));
    //         } else if (res.writableNeedDrain) {
    //             res.uncork()
    //         }
            
    //         console.log(data)
    //     }
    // } catch (error) {
    //     console.error(error)
    //     res.write(error)
    //     res.end()
    // }
    // res.end()
    // streaming pipeline example
    // const pipelinePromise = promisify(pipeline);
    // const stream = response.body;
    // const responseStream = res.write;
    // await pipelinePromise(stream, responseStream());

}

export default streamRoute;
function hyperquest(arg0: string) {
    throw new Error("Function not implemented.");
}

