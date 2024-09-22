import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { SetDIDStatusError, SetDIDStatusRequest, SetDIDStatusResponse } from '@/lib/core/usecase-models/set-did-status-usecase-models';
import { SetDIDStatusInputPort, type SetDIDStatusOutputPort } from '@/lib/core/port/primary/set-did-status-ports';

import { SetDIDStatusDTO } from '@/lib/core/dto/did-dto';
import type DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';

@injectable()
export default class SetDIDStatusUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<SetDIDStatusRequest>, SetDIDStatusResponse, SetDIDStatusError, SetDIDStatusDTO>
    implements SetDIDStatusInputPort
{
    constructor(protected readonly presenter: SetDIDStatusOutputPort, private readonly gateway: DIDGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<SetDIDStatusRequest>): SetDIDStatusError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<SetDIDStatusRequest>): Promise<SetDIDStatusDTO> {
        const { rucioAuthToken, scope, name, open } = requestModel;
        const dto: SetDIDStatusDTO = await this.gateway.setDIDStatus(rucioAuthToken, scope, name, open);
        return dto;
    }
    handleGatewayError(error: SetDIDStatusDTO): SetDIDStatusError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as SetDIDStatusError;
    }

    processDTO(dto: SetDIDStatusDTO): { data: SetDIDStatusResponse | SetDIDStatusError; status: 'success' | 'error' } {
        // copy all fields from dto to response model except success
        const responseModel: SetDIDStatusResponse = {
            ...dto,
            status: 'success',
        };

        return {
            status: 'success',
            data: responseModel,
        };
    }
}
