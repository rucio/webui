import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListAccountRSEUsageResponse,
    ListAccountRSEUsageRequest,
    ListAccountRSEUsageError,
} from '@/lib/core/usecase-models/list-account-rse-usage-usecase-models';
import { RSEAccountUsageViewModel } from '@/lib/infrastructure/data/view-model/rse';
/**
 * @interface ListAccountRSEUsageInputPort that abstracts the usecase.
 */
export interface ListAccountRSEUsageInputPort extends BaseAuthenticatedInputPort<ListAccountRSEUsageRequest> {}

/**
 * @interface ListAccountRSEUsageOutputPort that abtrsacts the presenter
 */
export interface ListAccountRSEUsageOutputPort
    extends BaseStreamingOutputPort<ListAccountRSEUsageResponse, ListAccountRSEUsageError, RSEAccountUsageViewModel> {}
