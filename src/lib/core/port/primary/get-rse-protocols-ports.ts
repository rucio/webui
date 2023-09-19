import { BaseAuthenticatedInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { GetRSEProtocolsError, GetRSEProtocolsRequest, GetRSEProtocolsResponse } from "@/lib/core/usecase-models/get-rse-protocols-usecase-models";

/**
 * @interface GetRSEProtocolsInputPort representing the GetRSEProtocols usecase.
 */
export interface GetRSEProtocolsInputPort extends BaseAuthenticatedInputPort<GetRSEProtocolsRequest> {}

/**
 * @interface GetRSEProtocolsOutputPort representing the GetRSEProtocols presenter.
 */
export interface GetRSEProtocolsOutputPort extends BaseOutputPort<GetRSEProtocolsResponse, GetRSEProtocolsError> {}
