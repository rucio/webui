import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { GetFTSLinkError, GetFTSLinkRequest, GetFTSLinkResponse } from '@/lib/core/usecase-models/get-fts-link-usecase-models';
import { GetFTSLinkInputPort, type GetFTSLinkOutputPort } from '@/lib/core/port/primary/get-fts-link-ports';
import type RequestGatewayOutputPort from '../port/secondary/request-gateway-output-port';
import { RequestDTO } from '../dto/request-dto';

@injectable()
export default class GetFTSLinkUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<GetFTSLinkRequest>, GetFTSLinkResponse, GetFTSLinkError, RequestDTO>
    implements GetFTSLinkInputPort
{
    constructor(protected readonly presenter: GetFTSLinkOutputPort, private readonly gateway: RequestGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<GetFTSLinkRequest>): GetFTSLinkError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetFTSLinkRequest>): Promise<RequestDTO> {
        const { rucioAuthToken, scope, name, rse } = requestModel;
        const dto: RequestDTO = await this.gateway.getRequest(rucioAuthToken, scope, name, rse);
        return dto;
    }
    handleGatewayError(error: RequestDTO): GetFTSLinkError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as GetFTSLinkError;
    }

    processDTO(dto: RequestDTO): { data: GetFTSLinkResponse | GetFTSLinkError; status: 'success' | 'error' } {
        const url = 'example.com';

        const responseModel: GetFTSLinkResponse = {
            url: url,
            status: 'success',
        };

        return {
            status: 'success',
            data: responseModel,
        };
    }
}
