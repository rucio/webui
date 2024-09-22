import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    DIDKeyValuePairsDataRequest,
    DIDKeyValuePairsDataResponse,
    DIDKeyValuePairsDataError,
} from '../../usecase-models/did-keyvaluepairs-usecase-models';

/**
 * @interface DIDKeyValuePairsDataInputPort representing the DIDKeyValuePairs usecase.
 */
export interface DIDKeyValuePairsDataInputPort extends BaseAuthenticatedInputPort<DIDKeyValuePairsDataRequest> {}

/**
 * @interface DIDKeyValuePairsDataOutputPort representing the DIDKeyValuePairs presenter.
 */
export interface DIDKeyValuePairsDataOutputPort extends BaseOutputPort<DIDKeyValuePairsDataResponse, DIDKeyValuePairsDataError> {}
