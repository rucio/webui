import { ListDIDsError } from "@/lib/core/data/usecase-models/list-dids-usecase-models";
import ListDIDsOutputPort from "@/lib/core/port/primary/list-dids-output-port";
import { NextApiResponse } from "next";
import { PassThrough } from "stream";

export default class ListDIDsPresenter implements ListDIDsOutputPort<NextApiResponse> {
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        this.response = response;
    }

    writeToResponse(chunk: any) {
        this.response.write(chunk.toString());
    }
    async presentStream(stream: PassThrough): Promise<void> {
        // stream.pipe(this.response);
        stream.on('data', (chunk) => {
            console.log(chunk.toString());
            this.writeToResponse(chunk);
        });
        stream.on('end', () => {
            this.response.end();
        });
    }

    async presentError(error: ListDIDsError): Promise<void> {
        this.response.status(400).json(JSON.stringify(error));
    }
}