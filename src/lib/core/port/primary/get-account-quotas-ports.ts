import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    GetAccountQuotasError,
    GetAccountQuotasRequest,
    GetAccountQuotasResponse,
} from '@/lib/core/usecase-models/get-account-quotas-usecase-models';

/**
 * @interface GetAccountQuotasInputPort representing the GetAccountQuotas usecase.
 */
export interface GetAccountQuotasInputPort extends BaseAuthenticatedInputPort<GetAccountQuotasRequest> {}

/**
 * @interface GetAccountQuotasOutputPort representing the GetAccountQuotas presenter.
 */
export interface GetAccountQuotasOutputPort extends BaseOutputPort<GetAccountQuotasResponse, GetAccountQuotasError> {}
