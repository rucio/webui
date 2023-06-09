import StreamingUseCase, { IStreamUseCase } from "@/lib/common/stream/stream-usecase";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";
import { ListDIDsRequest, ListDIDsResponse } from "../../data/usecase-models/list-dids-usecase-models";

/**
 * @interface ListDIDsInputPort to fetch a list of DIDs from the backend.
 */
export default interface ListDIDsInputPort { //extends IStreamUseCase<ListDIDsResponse, ListDIDsViewModel>{
    execute(request: ListDIDsRequest): void;
}