import { injectable } from 'inversify';
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    ListAccountRSEUsageError,
    ListAccountRSEUsageRequest,
    ListAccountRSEUsageResponse,
} from '@/lib/core/usecase-models/list-account-rse-usage-usecase-models';
import { ListAccountRSEUsageInputPort, type ListAccountRSEUsageOutputPort } from '@/lib/core/port/primary/list-account-rse-usage-ports';
import { RSEAccountUsageViewModel } from '@/lib/infrastructure/data/view-model/rse';

import { ListAccountRSEUsageDTO } from '@/lib/core/dto/account-dto';
import { AccountRSEUsageDTO } from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

@injectable()
export default class ListAccountRSEUsageUseCase
    extends BaseSingleEndpointStreamingUseCase<
        AuthenticatedRequestModel<ListAccountRSEUsageRequest>,
        ListAccountRSEUsageResponse,
        ListAccountRSEUsageError,
        ListAccountRSEUsageDTO,
        AccountRSEUsageDTO,
        RSEAccountUsageViewModel
    >
    implements ListAccountRSEUsageInputPort
{
    constructor(protected readonly presenter: ListAccountRSEUsageOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListAccountRSEUsageRequest>): ListAccountRSEUsageError | undefined {
        return undefined;
    }

    intializeRequest(
        request: AuthenticatedRequestModel<AuthenticatedRequestModel<ListAccountRSEUsageRequest>>,
    ): Promise<ListAccountRSEUsageError | undefined> {
        return Promise.resolve(undefined);
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListAccountRSEUsageRequest>): Promise<ListAccountRSEUsageDTO> {
        const { rucioAuthToken, account } = requestModel;
        const dto: ListAccountRSEUsageDTO = await this.gateway.listAccountRSEUsage(account, rucioAuthToken);
        return dto;
    }

    handleGatewayError(error: ListAccountRSEUsageDTO): ListAccountRSEUsageError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListAccountRSEUsageError;
    }

    processStreamedData(dto: AccountRSEUsageDTO): {
        data: ListAccountRSEUsageResponse | ListAccountRSEUsageError;
        status: 'success' | 'error';
    } {
        if (dto.status === 'error') {
            const errorModel: ListAccountRSEUsageError = {
                status: 'error',
                code: dto.errorCode || 500,
                message: dto.errorMessage || 'Could not fetch or process the fetched data',
                name: dto.errorName || 'Gateway Error',
            };
            return {
                status: 'error',
                data: errorModel,
            };
        }

        const responseModel: ListAccountRSEUsageResponse = {
            ...dto,
            status: 'success',
        };
        return {
            status: 'success',
            data: responseModel,
        };
    }
}
