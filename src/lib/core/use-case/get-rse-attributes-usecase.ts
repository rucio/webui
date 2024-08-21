import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    GetRSEAttributesError,
    GetRSEAttributesRequest,
    GetRSEAttributesResponse,
} from '@/lib/core/usecase-models/get-rse-attributes-usecase-models';
import { GetRSEAttributesInputPort, type GetRSEAttributesOutputPort } from '@/lib/core/port/primary/get-rse-attributes-ports';

import { RSEAttributeDTO } from '@/lib/core/dto/rse-dto';
import type RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';

@injectable()
export default class GetRSEAttributesUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<GetRSEAttributesRequest>,
        GetRSEAttributesResponse,
        GetRSEAttributesError,
        RSEAttributeDTO
    >
    implements GetRSEAttributesInputPort
{
    constructor(protected readonly presenter: GetRSEAttributesOutputPort, private readonly gateway: RSEGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<GetRSEAttributesRequest>): GetRSEAttributesError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetRSEAttributesRequest>): Promise<RSEAttributeDTO> {
        const { rucioAuthToken, rseName } = requestModel;
        const dto: RSEAttributeDTO = await this.gateway.getRSEAttributes(rucioAuthToken, rseName);
        return dto;
    }
    handleGatewayError(error: RSEAttributeDTO): GetRSEAttributesError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as GetRSEAttributesError;
    }

    processDTO(dto: RSEAttributeDTO): { data: GetRSEAttributesResponse | GetRSEAttributesError; status: 'success' | 'error' } {
        const responseModel: GetRSEAttributesResponse = {
            ...dto,
            status: 'success',
        };

        return {
            status: 'success',
            data: responseModel,
        };
    }
}
