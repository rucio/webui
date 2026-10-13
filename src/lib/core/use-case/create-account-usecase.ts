import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { checkAccountName, checkAccountType, checkOptionalEmail, toValidationError } from '@/lib/core/utils/account-validation';

import { CreateAccountError, CreateAccountRequest, CreateAccountResponse } from '@/lib/core/usecase-models/create-account-usecase-models';
import { CreateAccountInputPort, type CreateAccountOutputPort } from '@/lib/core/port/primary/create-account-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

/** The mutation DTO plus the name of the account that was created, so processDTO can report it. */
type CreateAccountDTO = AccountMutationDTO & { account: string };

@injectable()
export default class CreateAccountUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<CreateAccountRequest>, CreateAccountResponse, CreateAccountError, CreateAccountDTO>
    implements CreateAccountInputPort
{
    constructor(protected readonly presenter: CreateAccountOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<CreateAccountRequest>): CreateAccountError | undefined {
        const { account, accountType, email } = requestModel;
        return toValidationError<CreateAccountError>(checkAccountName(account), checkAccountType(accountType), checkOptionalEmail(email));
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<CreateAccountRequest>): Promise<CreateAccountDTO> {
        const { rucioAuthToken, account, accountType, email } = requestModel;
        const dto = await this.gateway.createAccount(rucioAuthToken, account, accountType, email);
        return { ...dto, account };
    }

    handleGatewayError(error: CreateAccountDTO): CreateAccountError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as CreateAccountError;
    }

    processDTO(dto: CreateAccountDTO): { data: CreateAccountResponse | CreateAccountError; status: 'success' | 'error' } {
        const responseModel: CreateAccountResponse = { status: 'success', account: dto.account };
        return { status: 'success', data: responseModel };
    }
}
