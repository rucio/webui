import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    ListAccountIdentitiesError,
    ListAccountIdentitiesRequest,
    ListAccountIdentitiesResponse,
} from '@/lib/core/usecase-models/list-account-identities-usecase-models';
import { ListAccountIdentitiesInputPort, type ListAccountIdentitiesOutputPort } from '@/lib/core/port/primary/list-account-identities-ports';

import { AccountIdentityListDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class ListAccountIdentitiesUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<ListAccountIdentitiesRequest>,
        ListAccountIdentitiesResponse,
        ListAccountIdentitiesError,
        AccountIdentityListDTO
    >
    implements ListAccountIdentitiesInputPort
{
    constructor(protected readonly presenter: ListAccountIdentitiesOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListAccountIdentitiesRequest>): ListAccountIdentitiesError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListAccountIdentitiesRequest>): Promise<AccountIdentityListDTO> {
        const { rucioAuthToken, account } = requestModel;
        return this.gateway.listAccountIdentities(rucioAuthToken, account);
    }

    handleGatewayError(error: AccountIdentityListDTO): ListAccountIdentitiesError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as ListAccountIdentitiesError;
    }

    processDTO(dto: AccountIdentityListDTO): { data: ListAccountIdentitiesResponse | ListAccountIdentitiesError; status: 'success' | 'error' } {
        const responseModel: ListAccountIdentitiesResponse = {
            status: 'success',
            account: dto.account,
            identities: dto.identities,
        };
        return { status: 'success', data: responseModel };
    }
}
