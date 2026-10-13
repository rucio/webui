import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { checkAccountName, checkIdentity, toValidationError } from '@/lib/core/utils/account-validation';

import {
    DeleteAccountIdentityError,
    DeleteAccountIdentityRequest,
    DeleteAccountIdentityResponse,
} from '@/lib/core/usecase-models/delete-account-identity-usecase-models';
import { DeleteAccountIdentityInputPort, type DeleteAccountIdentityOutputPort } from '@/lib/core/port/primary/delete-account-identity-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class DeleteAccountIdentityUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<DeleteAccountIdentityRequest>,
        DeleteAccountIdentityResponse,
        DeleteAccountIdentityError,
        AccountMutationDTO
    >
    implements DeleteAccountIdentityInputPort
{
    constructor(protected readonly presenter: DeleteAccountIdentityOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<DeleteAccountIdentityRequest>): DeleteAccountIdentityError | undefined {
        const { account, identity, authType } = requestModel;
        return toValidationError<DeleteAccountIdentityError>(checkAccountName(account), checkIdentity(identity, authType));
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<DeleteAccountIdentityRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account, identity, authType } = requestModel;
        return this.gateway.deleteAccountIdentity(rucioAuthToken, account, identity, authType);
    }

    handleGatewayError(error: AccountMutationDTO): DeleteAccountIdentityError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as DeleteAccountIdentityError;
    }

    processDTO(dto: AccountMutationDTO): { data: DeleteAccountIdentityResponse | DeleteAccountIdentityError; status: 'success' | 'error' } {
        const responseModel: DeleteAccountIdentityResponse = { status: 'success' };
        return { status: 'success', data: responseModel };
    }
}
