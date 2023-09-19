import { BaseAuthenticatedInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { GetRSEAttributesError, GetRSEAttributesRequest, GetRSEAttributesResponse } from "@/lib/core/usecase-models/get-rse-attributes-usecase-models";

/**
 * @interface GetRSEAttributesInputPort representing the GetRSEAttributes usecase.
 */
export interface GetRSEAttributesInputPort extends BaseAuthenticatedInputPort<GetRSEAttributesRequest> {}

/**
 * @interface GetRSEAttributesOutputPort representing the GetRSEAttributes presenter.
 */
export interface GetRSEAttributesOutputPort extends BaseOutputPort<GetRSEAttributesResponse, GetRSEAttributesError> {}
