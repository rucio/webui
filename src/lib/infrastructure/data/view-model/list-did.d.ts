import { BaseViewModel } from '@/lib/sdk/view-models';
import { ListDIDsRecordEnvelope } from '@/lib/core/usecase-models/list-dids-usecase-models';
import { DIDLong } from '@/lib/core/entity/rucio';

export interface ListDIDsViewModel extends DIDLong, BaseViewModel, ListDIDsRecordEnvelope {
    open: boolean;
}
