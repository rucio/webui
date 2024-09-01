import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListAccountRSEQuotasError,
    ListAccountRSEQuotasRequest,
    ListAccountRSEQuotasResponse,
} from '../../usecase-models/list-account-rse-quotas-usecase-models';

/**
 * @interface ListAccountRSEQuotasInputPort represents the ListAccountRSEQuotas input port.
 */
export interface ListAccountRSEQuotasInputPort extends BaseAuthenticatedInputPort<ListAccountRSEQuotasRequest> {}

/**
 * @interface ListAccountRSEQuotasOutputPort represents the ListAccountRSEQuotas output port.
 */
export interface ListAccountRSEQuotasOutputPort
    extends BaseStreamingOutputPort<ListAccountRSEQuotasResponse, ListAccountRSEQuotasError, RSEAccountUsageLimitViewModel> {}
