import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { checkAccountName, checkIdentity, checkEmail, toValidationError } from '@/lib/core/utils/account-validation';

import {
    AddAccountIdentityError,
    AddAccountIdentityRequest,
    AddAccountIdentityResponse,
} from '@/lib/core/usecase-models/add-account-identity-usecase-models';
import { AddAccountIdentityInputPort, type AddAccountIdentityOutputPort } from '@/lib/core/port/primary/add-account-identity-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class AddAccountIdentityUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<AddAccountIdentityRequest>,
        AddAccountIdentityResponse,
        AddAccountIdentityError,
        AccountMutationDTO
    >
    implements AddAccountIdentityInputPort
{
    constructor(protected readonly presenter: AddAccountIdentityOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<AddAccountIdentityRequest>): AddAccountIdentityError | undefined {
        // No password check: a USERPASS identity whose username already exists in Rucio needs none.
        const { account, identity, authType, email } = requestModel;
        return toValidationError<AddAccountIdentityError>(checkAccountName(account), checkIdentity(identity, authType), checkEmail(email));
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<AddAccountIdentityRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account, identity, authType, email, password, isDefault } = requestModel;
        return this.gateway.addAccountIdentity(rucioAuthToken, account, identity, authType, email, password, isDefault);
    }

    handleGatewayError(error: AccountMutationDTO): AddAccountIdentityError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as AddAccountIdentityError;
    }

    processDTO(dto: AccountMutationDTO): { data: AddAccountIdentityResponse | AddAccountIdentityError; status: 'success' | 'error' } {
        const responseModel: AddAccountIdentityResponse = { status: 'success' };
        return { status: 'success', data: responseModel };
    }
}
