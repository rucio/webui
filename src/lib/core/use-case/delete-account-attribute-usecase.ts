import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    DeleteAccountAttributeError,
    DeleteAccountAttributeRequest,
    DeleteAccountAttributeResponse,
} from '@/lib/core/usecase-models/delete-account-attribute-usecase-models';
import { DeleteAccountAttributeInputPort, type DeleteAccountAttributeOutputPort } from '@/lib/core/port/primary/delete-account-attribute-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class DeleteAccountAttributeUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<DeleteAccountAttributeRequest>,
        DeleteAccountAttributeResponse,
        DeleteAccountAttributeError,
        AccountMutationDTO
    >
    implements DeleteAccountAttributeInputPort
{
    constructor(protected readonly presenter: DeleteAccountAttributeOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<DeleteAccountAttributeRequest>): DeleteAccountAttributeError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<DeleteAccountAttributeRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account, key } = requestModel;
        return this.gateway.deleteAccountAttribute(rucioAuthToken, account, key);
    }

    handleGatewayError(error: AccountMutationDTO): DeleteAccountAttributeError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as DeleteAccountAttributeError;
    }

    processDTO(dto: AccountMutationDTO): { data: DeleteAccountAttributeResponse | DeleteAccountAttributeError; status: 'success' | 'error' } {
        const responseModel: DeleteAccountAttributeResponse = { status: 'success' };
        return { status: 'success', data: responseModel };
    }
}
