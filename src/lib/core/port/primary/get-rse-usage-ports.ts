import { BaseAuthenticatedInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { GetRSEUsageError, GetRSEUsageRequest, GetRSEUsageResponse } from "@/lib/core/usecase-models/get-rse-usage-usecase-models";

/**
 * @interface GetRSEUsageInputPort representing the GetRSEUsage usecase.
 */
export interface GetRSEUsageInputPort extends BaseAuthenticatedInputPort<GetRSEUsageRequest> {}

/**
 * @interface GetRSEUsageOutputPort representing the GetRSEUsage presenter.
 */
export interface GetRSEUsageOutputPort extends BaseOutputPort<GetRSEUsageResponse, GetRSEUsageError> {}
