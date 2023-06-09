import { IStreamPresenter } from "@/lib/common/stream/stream-presenter";
import { ListDIDsResponse, ListDIDsError } from "@/lib/core/data/usecase-models/list-dids-usecase-models";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";
import { PassThrough } from "node:stream";

export default interface ListDIDsOutputPort<T> { //extends IStreamPresenter<ListDIDsResponse, ListDIDsViewModel, ListDIDsError> {
    response: T;
    presentStream(stream: PassThrough): Promise<void>;
    presentError(error: ListDIDsError): Promise<void>;
}