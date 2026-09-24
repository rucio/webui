import { BaseViewModel } from '@/lib/sdk/view-models';

export interface PandaTaskLinkViewModel extends BaseViewModel {
    taskId: string;
    url: string;
    errorType?: 'invalid_task_id' | 'unknown';
}
