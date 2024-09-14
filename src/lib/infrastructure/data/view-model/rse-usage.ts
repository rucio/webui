import {BaseViewModel} from "@/lib/sdk/view-models";

export interface RSEUsageViewModel extends BaseViewModel {
    rse_id: string;
    rse: string;
    source: string;
    used: number;
    total: number;
    files: number;
    updated_at: string;
}
export const getEmptyRSEUsageViewModel = (): RSEUsageViewModel => {
    return {
        status: 'error',
        rse_id: '',
        rse: '',
        source: '',
        used: 0,
        total: 0,
        files: 0,
        updated_at: ''
    };
}