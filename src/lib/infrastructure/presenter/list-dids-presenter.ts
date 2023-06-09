import { ListDIDsError } from "@/lib/core/data/usecase-models/list-dids-usecase-models";
import ListDIDsOutputPort from "@/lib/core/port/primary/list-dids-output-port";
import { NextApiResponse } from "next";
import { PassThrough } from "stream";

export default class ListDIDsPresenter implements ListDIDsOutputPort<NextApiResponse> {
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        this.response = response;
    }

    async presentStream(stream: PassThrough): Promise<void> {
        stream.pipe(this.response);
    }

    async presentError(error: ListDIDsError): Promise<void> {
        this.response.status(400).json(JSON.stringify(error));
    }
}