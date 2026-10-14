import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { checkAccountName, checkRseExpression, checkBytes, toValidationError } from '@/lib/core/utils/account-validation';

import { SetAccountLimitError, SetAccountLimitRequest, SetAccountLimitResponse } from '@/lib/core/usecase-models/set-account-limit-usecase-models';
import { SetAccountLimitInputPort, type SetAccountLimitOutputPort } from '@/lib/core/port/primary/set-account-limit-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import type RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';

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
    constructor(
        protected readonly presenter: SetAccountLimitOutputPort,
        private readonly gateway: AccountGatewayOutputPort,
        private readonly rseGateway: RSEGatewayOutputPort,
    ) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<SetAccountLimitRequest>): SetAccountLimitError | undefined {
        const { account, rseExpression, bytes } = requestModel;
        return toValidationError<SetAccountLimitError>(checkAccountName(account), checkRseExpression(rseExpression), checkBytes(bytes));
    }

    /**
     * Rucio stores a global limit without resolving its expression, but listing the global limits or usage of the
     * account then fails with InvalidRSEExpression. So a global expression must match at least one RSE first.
     */
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<SetAccountLimitRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account, locality, rseExpression, bytes } = requestModel;
        if (locality === 'global') {
            const rsesDTO = await this.rseGateway.listRSEs(rucioAuthToken, rseExpression);
            if (rsesDTO.status === 'error') {
                const { errorCode, errorName, errorClass, errorMessage } = rsesDTO;
                if (errorClass !== 'InvalidRSEExpression') return { status: 'error', errorCode, errorName, errorClass, errorMessage };
                const syntax = typeof errorMessage === 'string' && errorMessage.includes('syntax');
                return {
                    status: 'error',
                    errorCode: 400,
                    errorName: 'Invalid RSE expression',
                    errorClass: 'InvalidRSEExpression',
                    errorMessage: syntax
                        ? 'The RSE expression is not valid. Check its syntax and try again.'
                        : 'The RSE expression matches no RSEs. A global quota needs an expression that matches at least one RSE.',
                };
            }
            // Only the existence of a match matters: release the stream.
            rsesDTO.stream?.destroy?.();
        }
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
