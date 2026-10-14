import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { checkAccountName, checkAttribute, toAttributeValueString, toValidationError } from '@/lib/core/utils/account-validation';

import {
    UpdateAccountAttributeError,
    UpdateAccountAttributeRequest,
    UpdateAccountAttributeResponse,
} from '@/lib/core/usecase-models/update-account-attribute-usecase-models';
import { UpdateAccountAttributeInputPort, type UpdateAccountAttributeOutputPort } from '@/lib/core/port/primary/update-account-attribute-ports';

import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

export const ATTRIBUTE_RESTORED_MESSAGE = 'The new value could not be saved. The previous value was restored.';
export const attributeMissingMessage = (key: string) =>
    `The new value could not be saved and the previous value could not be restored. The attribute ${key} is now missing.`;
export const attributeNotFoundMessage = (key: string) => `Attribute ${key} does not exist for this account.`;

/**
 * Rucio has no attribute update endpoint (adding an existing key answers 409), so an update is a delete
 * followed by an add, like `rucio account attribute set`. The request is validated and the current value
 * read first. If the add fails, the previous value is added back as a best-effort rollback.
 */
@injectable()
export default class UpdateAccountAttributeUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<UpdateAccountAttributeRequest>,
        UpdateAccountAttributeResponse,
        UpdateAccountAttributeError,
        AccountMutationDTO
    >
    implements UpdateAccountAttributeInputPort
{
    constructor(protected readonly presenter: UpdateAccountAttributeOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<UpdateAccountAttributeRequest>): UpdateAccountAttributeError | undefined {
        const { account, key, value } = requestModel;
        return toValidationError<UpdateAccountAttributeError>(checkAccountName(account), checkAttribute('key', key), checkAttribute('value', value));
    }

    async execute(requestModel: AuthenticatedRequestModel<UpdateAccountAttributeRequest>): Promise<void> {
        const validationError = this.validateRequestModel(requestModel);
        if (validationError) {
            await this.presenter.presentError(validationError);
            return;
        }
        const { rucioAuthToken, account, key, value } = requestModel;
        try {
            const current = await this.gateway.getAccountAttributes(rucioAuthToken, account);
            if (current.status !== 'success') {
                await this.presenter.presentError(this.toError(current));
                return;
            }
            const existing = current.attributes.find(a => a.key === key);
            if (!existing) {
                await this.presenter.presentError({
                    status: 'error',
                    message: attributeNotFoundMessage(key),
                    name: 'AttributeNotFound',
                    code: 404,
                } as UpdateAccountAttributeError);
                return;
            }
            const previous = toAttributeValueString(existing.value);
            if (previous === value) {
                await this.presenter.presentSuccess({ status: 'success' });
                return;
            }

            const deleted = await this.gateway.deleteAccountAttribute(rucioAuthToken, account, key);
            if (deleted.status !== 'success') {
                await this.presenter.presentError(this.toError(deleted));
                return;
            }

            let added: AccountMutationDTO;
            try {
                added = await this.gateway.addAccountAttribute(rucioAuthToken, account, key, value);
            } catch (thrown) {
                added = thrown as AccountMutationDTO;
                if (!added || added.status !== 'error')
                    added = { status: 'error', errorMessage: String(thrown), errorCode: 500 } as AccountMutationDTO;
            }
            if (added.status !== 'success') {
                const error = this.toError(added);
                const restored = await this.restore(rucioAuthToken, account, key, previous);
                await this.presenter.presentError({ ...error, message: restored ? ATTRIBUTE_RESTORED_MESSAGE : attributeMissingMessage(key) });
                return;
            }
            await this.presenter.presentSuccess({ status: 'success' });
        } catch (error) {
            await this.presenter.presentError(this.handleGatewayError(error as AccountMutationDTO));
        }
    }

    /** Best-effort rollback: add the previous value back. */
    private async restore(token: string, account: string, key: string, previous: string): Promise<boolean> {
        try {
            return (await this.gateway.addAccountAttribute(token, account, key, previous)).status === 'success';
        } catch {
            return false;
        }
    }

    private toError(dto: AccountMutationDTO): UpdateAccountAttributeError {
        return this.handleGatewayError(dto);
    }

    // The base class requires these; execute() is overridden because an update takes several gateway calls.
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<UpdateAccountAttributeRequest>): Promise<AccountMutationDTO> {
        const { rucioAuthToken, account, key, value } = requestModel;
        return this.gateway.addAccountAttribute(rucioAuthToken, account, key, value);
    }

    handleGatewayError(error: AccountMutationDTO): UpdateAccountAttributeError {
        return {
            status: 'error',
            message: error?.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error?.errorClass ?? error?.errorName,
            code: error?.errorCode ?? 500,
        } as UpdateAccountAttributeError;
    }

    processDTO(): { data: UpdateAccountAttributeResponse | UpdateAccountAttributeError; status: 'success' | 'error' } {
        return { status: 'success', data: { status: 'success' } };
    }
}
