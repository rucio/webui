import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { OpenDataDIDError, OpenDataDIDRequest, OpenDataDIDResponse } from '@/lib/core/usecase-models/opendata-did-usecase-models';

export interface OpenDataDIDInputPort extends BaseAuthenticatedInputPort<OpenDataDIDRequest> {}

export interface OpenDataDIDOutputPort extends BaseOutputPort<OpenDataDIDResponse, OpenDataDIDError> {}
