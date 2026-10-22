import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { checkAccountName, checkRseExpression, toValidationError } from '@/lib/core/utils/account-validation';

import {
    DeleteAccountLimitError,
    DeleteAccountLimitRequest,
    DeleteAccountLimitResponse,
} from '@/lib/core/usecase-models/delete-account-limit-usecase-models';
import { DeleteAccountLimitInputPort, type DeleteAccountLimitOutputPort } from '@/lib/core/port/primary/delete-account-limit-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class DeleteAccountLimitUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<DeleteAccountLimitRequest>,
        DeleteAccountLimitResponse,
        DeleteAccountLimitError,
        AccountMutationDTO
    >
    implements DeleteAccountLimitInputPort
{
    constructor(protected readonly presenter: DeleteAccountLimitOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<DeleteAccountLimitRequest>): DeleteAccountLimitError | undefined {
        const { account, rseExpression } = requestModel;
        return toValidationError<DeleteAccountLimitError>(checkAccountName(account), checkRseExpression(rseExpression));
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<DeleteAccountLimitRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account, locality, rseExpression } = requestModel;
        return this.gateway.deleteAccountLimit(rucioAuthToken, account, locality, rseExpression);
    }

    handleGatewayError(error: AccountMutationDTO): DeleteAccountLimitError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as DeleteAccountLimitError;
    }

    processDTO(dto: AccountMutationDTO): { data: DeleteAccountLimitResponse | DeleteAccountLimitError; status: 'success' | 'error' } {
        const responseModel: DeleteAccountLimitResponse = { status: 'success' };
        return { status: 'success', data: responseModel };
    }
}
