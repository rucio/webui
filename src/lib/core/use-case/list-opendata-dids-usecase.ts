import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import type OpenDataGatewayOutputPort from '@/lib/core/port/secondary/opendata-gateway-output-port';
import { ListOpenDataDIDsInputPort, type ListOpenDataDIDsOutputPort } from '@/lib/core/port/primary/list-opendata-dids-ports';
import {
    ListOpenDataDIDsError,
    ListOpenDataDIDsRequest,
    ListOpenDataDIDsResponse,
} from '@/lib/core/usecase-models/list-opendata-dids-usecase-models';

type ListOpenDataDIDsDTO = Awaited<ReturnType<OpenDataGatewayOutputPort['listOpenDataDIDs']>>;

@injectable()
class ListOpenDataDIDsUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<ListOpenDataDIDsRequest>,
        ListOpenDataDIDsResponse,
        ListOpenDataDIDsError,
        ListOpenDataDIDsDTO
    >
    implements ListOpenDataDIDsInputPort
{
    constructor(protected readonly presenter: ListOpenDataDIDsOutputPort, private readonly gateway: OpenDataGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListOpenDataDIDsRequest>): ListOpenDataDIDsError | undefined {
        if (!requestModel.rucioAuthToken) {
            return {
                status: 'error',
                code: 401,
                name: 'Authentication Error',
                error: 'INVALID_AUTH',
                message: 'Auth token is required',
            };
        }

        if (requestModel.limit !== undefined && (!Number.isInteger(requestModel.limit) || requestModel.limit <= 0)) {
            return {
                status: 'error',
                code: 400,
                name: 'Invalid Request',
                error: 'INVALID_REQUEST',
                message: 'Limit must be a positive integer',
            };
        }

        if (requestModel.offset !== undefined && (!Number.isInteger(requestModel.offset) || requestModel.offset < 0)) {
            return {
                status: 'error',
                code: 400,
                name: 'Invalid Request',
                error: 'INVALID_REQUEST',
                message: 'Offset must be a non-negative integer',
            };
        }

        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListOpenDataDIDsRequest>): Promise<ListOpenDataDIDsDTO> {
        return this.gateway.listOpenDataDIDs(requestModel.rucioAuthToken, requestModel.limit, requestModel.offset, requestModel.state);
    }

    handleGatewayError(error: ListOpenDataDIDsDTO): ListOpenDataDIDsError {
        let errorType: ListOpenDataDIDsError['error'];

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

    processDTO(dto: ListOpenDataDIDsDTO): {
        data: ListOpenDataDIDsResponse | ListOpenDataDIDsError;
        status: 'success' | 'error';
    } {
        return {
            data: {
                status: 'success',
                total: dto.total,
                offset: dto.offset,
                dids: dto.dids,
            },
            status: 'success',
        };
    }
}

export default ListOpenDataDIDsUseCase;
