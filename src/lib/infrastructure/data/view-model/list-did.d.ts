import { ListDIDsResponse } from "@/lib/core/data/usecase-models/list-dids-usecase-models";
import { DID } from "@/lib/core/entity/rucio";

export interface ListDIDsViewModel extends DID {
    bytes: number;
    length: number;
}