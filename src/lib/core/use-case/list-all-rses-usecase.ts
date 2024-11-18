import { injectable } from 'inversify';
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { ListAllRSEsError, ListAllRSEsRequest, ListAllRSEsResponse } from '@/lib/core/usecase-models/list-all-rses-usecase-models';
import { ListAllRSEsInputPort, type ListAllRSEsOutputPort } from '@/lib/core/port/primary/list-all-rses-ports';
import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';

import { ListRSEsDTO, RSEDetailsDTO } from '@/lib/core/dto/rse-dto';
import type RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';

@injectable()
export default class ListAllRSEsUseCase
    extends BaseSingleEndpointStreamingUseCase<
        AuthenticatedRequestModel<ListAllRSEsRequest>,
        ListAllRSEsResponse,
        ListAllRSEsError,
        ListRSEsDTO,
        RSEDetailsDTO,
        RSEViewModel
    >
    implements ListAllRSEsInputPort
{
    constructor(protected readonly presenter: ListAllRSEsOutputPort, private readonly gateway: RSEGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListAllRSEsRequest>): ListAllRSEsError | undefined {
        return undefined;
    }

    async intializeRequest(request: AuthenticatedRequestModel<AuthenticatedRequestModel<ListAllRSEsRequest>>): Promise<ListAllRSEsError | undefined> {
        return Promise.resolve(undefined);
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListAllRSEsRequest>): Promise<ListRSEsDTO> {
        const { rucioAuthToken } = requestModel;
        // pass empty string as rse to list all rses
        const dto: ListRSEsDTO = await this.gateway.listRSEs(rucioAuthToken, '');
        return dto;
    }

    handleGatewayError(error: ListRSEsDTO): ListAllRSEsError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListAllRSEsError;
    }

    processStreamedData(dto: RSEDetailsDTO): { data: ListAllRSEsResponse | ListAllRSEsError; status: 'success' | 'error' } {
        if (dto.status === 'error') {
            const errorModel: ListAllRSEsError = {
                status: 'error',
                code: dto.errorCode || 500,
                message: dto.errorMessage || 'Could not fetch or process the fetched data',
                name: dto.errorName || 'Gateway Error',
            };
            return {
                status: 'error',
                data: errorModel,
            };
        }

        const responseModel: ListAllRSEsResponse = {
            ...dto,
            status: 'success',
        };
        return {
            status: 'success',
            data: responseModel,
        };
    }
}
