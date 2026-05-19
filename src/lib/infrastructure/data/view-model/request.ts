import { BaseViewModel } from '@/lib/sdk/view-models';

export interface FTSLinkViewModel extends BaseViewModel {
    url: string;
}

export interface DDMLinkViewModel extends BaseViewModel {
    url: string;
    errorType?: 'feature_disabled' | 'config_not_found' | 'unknown';
}
