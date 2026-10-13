import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { checkAccountName, checkRseExpression, checkBytes, toValidationError } from '@/lib/core/utils/account-validation';

import { SetAccountLimitError, SetAccountLimitRequest, SetAccountLimitResponse } from '@/lib/core/usecase-models/set-account-limit-usecase-models';
import { SetAccountLimitInputPort, type SetAccountLimitOutputPort } from '@/lib/core/port/primary/set-account-limit-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class SetAccountLimitUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<SetAccountLimitRequest>,
        SetAccountLimitResponse,
        SetAccountLimitError,
        AccountMutationDTO
    >
    implements SetAccountLimitInputPort
{
    constructor(protected readonly presenter: SetAccountLimitOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<SetAccountLimitRequest>): SetAccountLimitError | undefined {
        const { account, rseExpression, bytes } = requestModel;
        return toValidationError<SetAccountLimitError>(checkAccountName(account), checkRseExpression(rseExpression), checkBytes(bytes));
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<SetAccountLimitRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account, locality, rseExpression, bytes } = requestModel;
        return this.gateway.setAccountLimit(rucioAuthToken, account, locality, rseExpression, bytes);
    }

    handleGatewayError(error: AccountMutationDTO): SetAccountLimitError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as SetAccountLimitError;
    }

    processDTO(dto: AccountMutationDTO): { data: SetAccountLimitResponse | SetAccountLimitError; status: 'success' | 'error' } {
        const responseModel: SetAccountLimitResponse = { status: 'success' };
        return { status: 'success', data: responseModel };
    }
}
