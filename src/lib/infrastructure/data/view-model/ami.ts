import { BaseViewModel } from '@/lib/sdk/view-models';
import { AMITagInfo } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';

export interface AMITagInfoViewModel extends BaseViewModel {
    tags: AMITagInfo[];
    errorType?: 'invalid_tags' | 'unknown';
}
