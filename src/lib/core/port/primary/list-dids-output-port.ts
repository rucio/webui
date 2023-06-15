import { ListDIDsResponse, ListDIDsError } from "@/lib/core/data/usecase-models/list-dids-usecase-models";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";
import { PassThrough } from "node:stream";

export default interface ListDIDsOutputPort<T> {
    response: T;
    presentStream(stream: PassThrough): Promise<void>;
    presentError(error: ListDIDsError): Promise<void>;
}