import { injectable } from 'inversify';
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { ListAccountsError, ListAccountsRequest, ListAccountsResponse } from '@/lib/core/usecase-models/list-accounts-usecase-models';
import { ListAccountsInputPort, type ListAccountsOutputPort } from '@/lib/core/port/primary/list-accounts-ports';
import { AccountListItemViewModel } from '@/lib/infrastructure/data/view-model/account';

import { AccountListItemDTO, ListAccountsDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import { ACCOUNT_NAME_PATTERN_REGEX } from '@/lib/core/utils/account-validation';
import { AccountType } from '@/lib/core/entity/rucio';

const MAX_IDENTITY_LENGTH = 1024;

@injectable()
export default class ListAccountsUseCase
    extends BaseSingleEndpointStreamingUseCase<
        ListAccountsRequest,
        ListAccountsResponse,
        ListAccountsError,
        ListAccountsDTO,
        AccountListItemDTO,
        AccountListItemViewModel
    >
    implements ListAccountsInputPort
{
    constructor(protected readonly presenter: ListAccountsOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListAccountsRequest>): ListAccountsError | undefined {
        const { account, accountType, identity } = requestModel.filter ?? {};
        let message: string | undefined;
        if (account !== undefined && !ACCOUNT_NAME_PATTERN_REGEX.test(account)) {
            message = 'Invalid account name filter';
        } else if (accountType !== undefined && ![AccountType.USER, AccountType.GROUP, AccountType.SERVICE].includes(accountType)) {
            message = 'Invalid account type filter';
        } else if (identity !== undefined && identity.length > MAX_IDENTITY_LENGTH) {
            message = 'Identity filter is too long';
        }
        if (message) {
            return { status: 'error', code: 400, name: 'ValidationError', message } as ListAccountsError;
        }
        return undefined;
    }

    async intializeRequest(request: AuthenticatedRequestModel<ListAccountsRequest>): Promise<ListAccountsError | undefined> {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListAccountsRequest>): Promise<ListAccountsDTO> {
        const { rucioAuthToken, filter } = requestModel;
        return this.gateway.listAccounts(rucioAuthToken, filter);
    }

    handleGatewayError(error: ListAccountsDTO): ListAccountsError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as ListAccountsError;
    }

    processStreamedData(dto: AccountListItemDTO): { data: ListAccountsResponse | ListAccountsError; status: 'success' | 'error' } {
        if (dto.status === 'error') {
            const errorModel: ListAccountsError = {
                status: 'error',
                code: dto.errorCode || 500,
                message: dto.errorMessage || 'Could not fetch or process the fetched data',
                name: dto.errorClass ?? dto.errorName ?? 'Gateway Error',
            };
            return { status: 'error', data: errorModel };
        }
        const responseModel: ListAccountsResponse = { ...dto, status: 'success' };
        return { status: 'success', data: responseModel };
    }
}
