import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { checkAccountName, checkAttribute, toValidationError } from '@/lib/core/utils/account-validation';

import {
    AddAccountAttributeError,
    AddAccountAttributeRequest,
    AddAccountAttributeResponse,
} from '@/lib/core/usecase-models/add-account-attribute-usecase-models';
import { AddAccountAttributeInputPort, type AddAccountAttributeOutputPort } from '@/lib/core/port/primary/add-account-attribute-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class AddAccountAttributeUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<AddAccountAttributeRequest>,
        AddAccountAttributeResponse,
        AddAccountAttributeError,
        AccountMutationDTO
    >
    implements AddAccountAttributeInputPort
{
    constructor(protected readonly presenter: AddAccountAttributeOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<AddAccountAttributeRequest>): AddAccountAttributeError | undefined {
        const { account, key, value } = requestModel;
        return toValidationError<AddAccountAttributeError>(checkAccountName(account), checkAttribute('key', key), checkAttribute('value', value));
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<AddAccountAttributeRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account, key, value } = requestModel;
        return this.gateway.addAccountAttribute(rucioAuthToken, account, key, value);
    }

    handleGatewayError(error: AccountMutationDTO): AddAccountAttributeError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as AddAccountAttributeError;
    }

    processDTO(dto: AccountMutationDTO): { data: AddAccountAttributeResponse | AddAccountAttributeError; status: 'success' | 'error' } {
        const responseModel: AddAccountAttributeResponse = { status: 'success' };
        return { status: 'success', data: responseModel };
    }
}
