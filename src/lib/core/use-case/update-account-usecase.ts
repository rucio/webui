import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { UpdateAccountError, UpdateAccountRequest, UpdateAccountResponse } from '@/lib/core/usecase-models/update-account-usecase-models';
import { UpdateAccountInputPort, type UpdateAccountOutputPort } from '@/lib/core/port/primary/update-account-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class UpdateAccountUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<UpdateAccountRequest>, UpdateAccountResponse, UpdateAccountError, AccountMutationDTO>
    implements UpdateAccountInputPort
{
    constructor(protected readonly presenter: UpdateAccountOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<UpdateAccountRequest>): UpdateAccountError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<UpdateAccountRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account, options } = requestModel;
        return this.gateway.updateAccount(rucioAuthToken, account, options);
    }

    handleGatewayError(error: AccountMutationDTO): UpdateAccountError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as UpdateAccountError;
    }

    processDTO(dto: AccountMutationDTO): { data: UpdateAccountResponse | UpdateAccountError; status: 'success' | 'error' } {
        const responseModel: UpdateAccountResponse = { status: 'success' };
        return { status: 'success', data: responseModel };
    }
}
