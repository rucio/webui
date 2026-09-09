import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { injectable } from 'inversify';

import { OpenDataDIDDTO } from '@/lib/core/dto/opendata-dto';
import { OpenDataDIDInputPort, type OpenDataDIDOutputPort } from '@/lib/core/port/primary/opendata-did-ports';
import type OpenDataGatewayOutputPort from '@/lib/core/port/secondary/opendata-gateway-output-port';
import { OpenDataDIDError, OpenDataDIDRequest, OpenDataDIDResponse } from '@/lib/core/usecase-models/opendata-did-usecase-models';

@injectable()
class OpenDataDIDUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<OpenDataDIDRequest>, OpenDataDIDResponse, OpenDataDIDError, OpenDataDIDDTO>
    implements OpenDataDIDInputPort
{
    constructor(protected readonly presenter: OpenDataDIDOutputPort, private readonly gateway: OpenDataGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<OpenDataDIDRequest>): OpenDataDIDError | undefined {
        if (!requestModel.scope) {
            return {
                status: 'error',
                code: 400,
                name: 'Invalid Request',
                error: 'INVALID_REQUEST',
                message: 'Scope is required',
            };
        }

        if (!requestModel.did) {
            return {
                status: 'error',
                code: 400,
                name: 'Invalid Request',
                error: 'INVALID_REQUEST',
                message: 'DID is required',
            };
        }

        if (!requestModel.rucioAuthToken) {
            return {
                status: 'error',
                code: 401,
                name: 'Authentication Error',
                error: 'INVALID_AUTH',
                message: 'Auth token is required',
            };
        }

        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<OpenDataDIDRequest>): Promise<OpenDataDIDDTO> {
        return this.gateway.getOpenDataDID(requestModel.rucioAuthToken, requestModel.scope, requestModel.did);
    }

    handleGatewayError(error: OpenDataDIDDTO): OpenDataDIDError {
        let errorType: OpenDataDIDError['error'];

        switch (error.errorCode) {
            case 400:
                errorType = 'INVALID_REQUEST';
                break;

            case 401:
            case 403:
                errorType = 'INVALID_AUTH';
                break;

            case 404:
                errorType = 'NOT_FOUND';
                break;

            default:
                errorType = 'UNKNOWN_ERROR';
                break;
        }

        return {
            status: 'error',
            code: error.errorCode ?? 500,
            name: error.errorName ?? 'Gateway Error',
            error: errorType,
            message: error.errorMessage ?? 'Unknown error',
        };
    }

    processDTO(dto: OpenDataDIDDTO): {
        data: OpenDataDIDResponse | OpenDataDIDError;
        status: 'success' | 'error';
    } {
        return {
            data: {
                status: 'success',
                scope: dto.scope,
                name: dto.name,
                state: dto.state,
                doi: dto.doi,
                record_id: dto.record_id,
                files: dto.files,
                meta: dto.meta,
            },
            status: 'success',
        };
    }
}

export default OpenDataDIDUseCase;
