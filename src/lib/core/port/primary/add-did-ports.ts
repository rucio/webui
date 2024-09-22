import { BaseAuthenticatedInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { AddDIDError, AddDIDRequest, AddDIDResponse } from "@/lib/core/usecase-models/add-did-usecase-models";

/**
 * @interface AddDIDInputPort representing the AddDID usecase.
 */
export interface AddDIDInputPort extends BaseAuthenticatedInputPort<AddDIDRequest> {}

/**
 * @interface AddDIDOutputPort representing the AddDID presenter.
 */
export interface AddDIDOutputPort extends BaseOutputPort<AddDIDResponse, AddDIDError> {}
