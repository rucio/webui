import { BaseAuthenticatedInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { DIDMetaError, DIDMetaRequest, DIDMetaResponse } from "../../usecase-models/did-meta-usecase-models";

/**
 * @interface DIDMetaInputPort representing the DIDMeta usecase.
 */
export interface DIDMetaInputPort extends BaseAuthenticatedInputPort<DIDMetaRequest> {}

/**
 * @interface DIDMetaOutputPort representing the DIDMeta presenter.
 */
export interface DIDMetaOutputPort extends BaseOutputPort<DIDMetaResponse, DIDMetaError> {}