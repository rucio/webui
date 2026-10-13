import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { DeleteAccountError, DeleteAccountRequest, DeleteAccountResponse } from '@/lib/core/usecase-models/delete-account-usecase-models';
import { DeleteAccountInputPort, type DeleteAccountOutputPort } from '@/lib/core/port/primary/delete-account-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class DeleteAccountUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<DeleteAccountRequest>, DeleteAccountResponse, DeleteAccountError, AccountMutationDTO>
    implements DeleteAccountInputPort
{
    constructor(protected readonly presenter: DeleteAccountOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<DeleteAccountRequest>): DeleteAccountError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<DeleteAccountRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account } = requestModel;
        return this.gateway.deleteAccount(rucioAuthToken, account);
    }

    handleGatewayError(error: AccountMutationDTO): DeleteAccountError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as DeleteAccountError;
    }

    processDTO(dto: AccountMutationDTO): { data: DeleteAccountResponse | DeleteAccountError; status: 'success' | 'error' } {
        const responseModel: DeleteAccountResponse = { status: 'success' };
        return { status: 'success', data: responseModel };
    }
}
