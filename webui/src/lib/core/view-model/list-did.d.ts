import { BaseViewModel } from '@/lib/sdk/view-models';
import { ListDIDsResponse } from '@/lib/core/usecase-models/list-dids-usecase-models';
import { DID, DIDLong } from '@/lib/core/entity/rucio';

export interface ListDIDsViewModel extends DIDLong, BaseViewModel {
    open: boolean;
}
