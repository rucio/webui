import { BaseViewModel } from '@/lib/sdk/view-models';
import { DIDExtended, DIDShort, DIDType } from '@/lib/core/entity/rucio';

export interface ListDIDsViewModel extends DIDShort, BaseViewModel {}
export interface ListExtendedDIDsViewModel extends DIDExtended, BaseViewModel {}
export function generateEmptyListExtendedDIDsViewModel(): ListExtendedDIDsViewModel {
    return {
        status: 'error',
        name: '',
        scope: '',
        did_type: DIDType.UNKNOWN,
        account: '',
        adler32: null,
        bytes: 0,
        expired_at: null,
        length: 0,
        md5: null,
        monotonic: null,
        open: null,
    };
}
