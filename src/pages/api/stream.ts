import { NextApiRequest, NextApiResponse } from "next";
import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util'
import fetch from 'node-fetch';


const streamRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ message: "Stream" });
    // fetch("http://localhost:5000/stream", {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/x-json-stream",
    //     },
    // }).then((response) => response.json()).then( data =>{
    //     console.log(data);
    // });

    const response = await fetch("http://localhost:5000/stream")
    try {
        for await (const chunk of response.body) {
            let data = chunk.toString();
            res.pipe(data);
        }
    } catch (error) {
        console.error(error)
    }

}

export default streamRoute;
function hyperquest(arg0: string) {
    throw new Error("Function not implemented.");
}

