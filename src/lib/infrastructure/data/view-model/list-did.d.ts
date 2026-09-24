import { BaseViewModel } from '@/lib/sdk/view-models';
import { ListDIDsNotice, ListDIDsProgress, ListDIDsRecordKind } from '@/lib/core/usecase-models/list-dids-usecase-models';
import { DIDLong } from '@/lib/core/entity/rucio';

export interface ListDIDsViewModel extends DIDLong, BaseViewModel {
    open: boolean;
    /** Absent means 'did'. Only ALL searches emit the other kinds. */
    kind?: ListDIDsRecordKind;
    progress?: ListDIDsProgress;
    notice?: ListDIDsNotice;
}
