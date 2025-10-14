import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { BaseStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel, BaseErrorResponseModel } from '@/lib/sdk/usecase-models';
import { collectStreamedData } from '@/lib/sdk/utils';
import { injectable } from 'inversify';
import { Transform, Readable, PassThrough } from 'stream';
import { AccountRSELimitDTO, AccountRSEUsageDTO } from '../dto/account-dto';
import { ListRSEsDTO, RSEDetailsDTO } from '../dto/rse-dto';
import { DIDLong } from '../entity/rucio';
import { TAccountRSEUsageAndLimits, TRSESummaryRow } from '../entity/rule-summary';
import type { ListAccountRSEQuotasInputPort, ListAccountRSEQuotasOutputPort } from '../port/primary/list-account-rse-quotas-ports';
import type AccountGatewayOutputPort from '../port/secondary/account-gateway-output-port';
import type RSEGatewayOutputPort from '../port/secondary/rse-gateway-output-port';
import {
    ListAccountRSEQuotasError,
    ListAccountRSEQuotasRequest,
    ListAccountRSEQuotasResponse,
} from '../usecase-models/list-account-rse-quotas-usecase-models';
import { createAccountRSEUsageAndLimitMap, getQuotaInfo } from '../utils/create-rule-utils';

@injectable()
export default class ListAccountRSEQuotasUseCase
    extends BaseStreamingUseCase<
        AuthenticatedRequestModel<ListAccountRSEQuotasRequest>,
        ListAccountRSEQuotasResponse,
        ListAccountRSEQuotasError,
        RSEDetailsDTO,
        RSEAccountUsageLimitViewModel
    >
    implements ListAccountRSEQuotasInputPort
{
    private accountRSEUsageAndLimits: TAccountRSEUsageAndLimits = {};
    private totalDIDBytesRequested: number = 0;
    private account: string = '';

    constructor(
        protected readonly presenter: ListAccountRSEQuotasOutputPort,
        protected readonly rseGateway: RSEGatewayOutputPort,
        protected readonly accountGateway: AccountGatewayOutputPort,
    ) {
        super(presenter);
    }

    validateRequestModel(
        requestModel: AuthenticatedRequestModel<AuthenticatedRequestModel<ListAccountRSEQuotasRequest>>,
    ): ListAccountRSEQuotasError | undefined {
        return undefined;
    }

    async intializeRequest(request: AuthenticatedRequestModel<ListAccountRSEQuotasRequest>): Promise<undefined | ListAccountRSEQuotasError> {
        this.account = request.account;
        const accountLimitsDTO: AccountRSELimitDTO = await this.accountGateway.getAccountRSELimits(request.account, request.rucioAuthToken);
        if (accountLimitsDTO.status === 'error') {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: accountLimitsDTO.errorCode || 500,
                message: accountLimitsDTO.errorMessage || 'Could not fetch or process the fetched data',
                error: accountLimitsDTO.errorName || 'UseCase Error',
                name: accountLimitsDTO.errorName || 'UseCase Error',
            };
            return errorModel;
        }

        const listAccountUsageDTO = await this.accountGateway.listAccountRSEUsage(request.account, request.rucioAuthToken);
        if (listAccountUsageDTO.status === 'error') {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: listAccountUsageDTO.errorCode || 500,
                message: listAccountUsageDTO.errorMessage || 'Could not fetch or process the fetched data',
                error: listAccountUsageDTO.errorName || 'UseCase Error',
                name: listAccountUsageDTO.errorName || 'UseCase Error',
            };
            return errorModel;
        }

        if (listAccountUsageDTO.stream === undefined || listAccountUsageDTO.stream === null) {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: 500,
                message: 'Could not get the stream or process the fetched data ( ListAccountUsageDTO )',
                error: 'UseCase Error',
                name: 'UseCase Error',
            };
            return errorModel;
        }

        const accountUsageDTOs: AccountRSEUsageDTO[] = await collectStreamedData<AccountRSEUsageDTO>(listAccountUsageDTO.stream);

        const accountRSEUsageAndLimitsMap = createAccountRSEUsageAndLimitMap(accountLimitsDTO, accountUsageDTOs);
        this.accountRSEUsageAndLimits = accountRSEUsageAndLimitsMap;

        request.requestedDIDs.forEach((did: DIDLong) => {
            this.totalDIDBytesRequested += did.bytes;
        });
    }

    async generateSourceStream(requestModel: AuthenticatedRequestModel<AuthenticatedRequestModel<ListAccountRSEQuotasRequest>>): Promise<{
        status: 'success' | 'error';
        stream?: Transform | Readable | PassThrough | null | undefined;
        error?: ListAccountRSEQuotasError | undefined;
    }> {
        const listRSEDTO: ListRSEsDTO = await this.rseGateway.listRSEs(requestModel.rucioAuthToken, requestModel.rseExpression);
        if (listRSEDTO.status === 'error') {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: listRSEDTO.errorCode || 500,
                message: listRSEDTO.errorMessage || 'Could not fetch or process the fetched data',
                error: listRSEDTO.errorName || 'UseCase Error',
                name: listRSEDTO.errorName || 'UseCase Error',
            };
            return {
                status: 'error',
                error: errorModel,
            };
        }
        if (listRSEDTO.stream === undefined || listRSEDTO.stream === null) {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: 500,
                message: 'Could not get the stream or process the fetched data',
                error: 'UseCase Error',
                name: 'UseCase Error',
            };
            return {
                status: 'error',
                error: errorModel,
            };
        } else {
            return {
                status: 'success',
                stream: listRSEDTO.stream,
            };
        }
    }

    processStreamedData(rse: RSEDetailsDTO): { data: ListAccountRSEQuotasResponse | ListAccountRSEQuotasError; status: 'success' | 'error' } {
        const quotaInfo: (TRSESummaryRow & { status: 'success' }) | BaseErrorResponseModel = getQuotaInfo(
            rse,
            this.account,
            this.accountRSEUsageAndLimits,
            this.totalDIDBytesRequested,
        );

        if (quotaInfo.status === 'error') {
            return {
                status: 'error',
                data: {
                    status: 'error',
                    code: quotaInfo.code || 500,
                    message: quotaInfo.message || 'Could not fetch or process the fetched data',
                    error: 'UseCase Error',
                    name: quotaInfo.name || 'UseCase Error',
                },
            };
        }

        return {
            status: 'success',
            data: quotaInfo as ListAccountRSEQuotasResponse,
        };
    }
}
