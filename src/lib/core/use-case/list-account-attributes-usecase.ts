import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    ListAccountAttributesError,
    ListAccountAttributesRequest,
    ListAccountAttributesResponse,
} from '@/lib/core/usecase-models/list-account-attributes-usecase-models';
import { ListAccountAttributesInputPort, type ListAccountAttributesOutputPort } from '@/lib/core/port/primary/list-account-attributes-ports';

import { AccountAttributeListDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class ListAccountAttributesUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<ListAccountAttributesRequest>,
        ListAccountAttributesResponse,
        ListAccountAttributesError,
        AccountAttributeListDTO
    >
    implements ListAccountAttributesInputPort
{
    constructor(protected readonly presenter: ListAccountAttributesOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListAccountAttributesRequest>): ListAccountAttributesError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListAccountAttributesRequest>): Promise<AccountAttributeListDTO> {
        const { rucioAuthToken, account } = requestModel;
        return this.gateway.getAccountAttributes(rucioAuthToken, account);
    }

    handleGatewayError(error: AccountAttributeListDTO): ListAccountAttributesError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as ListAccountAttributesError;
    }

    processDTO(dto: AccountAttributeListDTO): { data: ListAccountAttributesResponse | ListAccountAttributesError; status: 'success' | 'error' } {
        const responseModel: ListAccountAttributesResponse = {
            status: 'success',
            account: dto.account,
            attributes: dto.attributes,
        };
        return { status: 'success', data: responseModel };
    }
}
