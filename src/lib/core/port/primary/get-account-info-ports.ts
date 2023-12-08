import { BaseAuthenticatedInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { GetAccountInfoError, GetAccountInfoRequest, GetAccountInfoResponse } from "@/lib/core/usecase-models/get-account-info-usecase-models";

/**
 * @interface GetAccountInfoInputPort representing the GetAccountInfo usecase.
 */
export interface GetAccountInfoInputPort extends BaseAuthenticatedInputPort<GetAccountInfoRequest> {}

/**
 * @interface GetAccountInfoOutputPort representing the GetAccountInfo presenter.
 */
export interface GetAccountInfoOutputPort extends BaseOutputPort<GetAccountInfoResponse, GetAccountInfoError> {}
