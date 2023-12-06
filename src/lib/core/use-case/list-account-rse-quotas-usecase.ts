import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { BaseStreamingUseCase, BaseUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { collectStreamedData } from "@/lib/sdk/utils";
import { injectable } from "inversify";
import { Transform, Readable, PassThrough } from "stream";
import { AccountRSELimitDTO, AccountRSEUsageDTO } from "../dto/account-dto";
import { ListRSEsDTO, RSEDTO } from "../dto/rse-dto";
import { DIDLong, RSEAccountUsage as RSEAccountUsage } from "../entity/rucio";
import type { ListAccountRSEQuotasInputPort, ListAccountRSEQuotasOutputPort } from "../port/primary/list-account-rse-quotas-ports";
import type AccountGatewayOutputPort from "../port/secondary/account-gateway-output-port";
import type RSEGatewayOutputPort from "../port/secondary/rse-gateway-output-port";
import { ListAccountRSEQuotasError, ListAccountRSEQuotasRequest, ListAccountRSEQuotasResponse } from "../usecase-models/list-account-rse-quotas-usecase-models";

type TAccountRSEUsageAndLimit = {
    limit: number | undefined
    bytesRemaining: number | undefined
}

type TAccountRSEUsageAndLimits = Record<string, TAccountRSEUsageAndLimit>

@injectable()
export default class ListAccountRSEQuotasUseCase extends BaseStreamingUseCase<AuthenticatedRequestModel<ListAccountRSEQuotasRequest>, ListAccountRSEQuotasResponse, ListAccountRSEQuotasError, RSEDTO, RSEAccountUsageLimitViewModel > implements ListAccountRSEQuotasInputPort {
    private readonly accountRSEUsageAndLimits: TAccountRSEUsageAndLimits = {};
    private totalDIDBytesRequested: number = 0;
    private account: string = '';

    constructor(
        protected readonly presenter: ListAccountRSEQuotasOutputPort,
        protected readonly rseGateway: RSEGatewayOutputPort,
        protected readonly accountGateway: AccountGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<AuthenticatedRequestModel<ListAccountRSEQuotasRequest>>): ListAccountRSEQuotasError | undefined {
        return undefined;
    }

    async intializeRequest(request: AuthenticatedRequestModel<ListAccountRSEQuotasRequest> ): Promise<undefined | ListAccountRSEQuotasError> {
        this.account = request.account;
        const accountLimitsDTO: AccountRSELimitDTO = await this.accountGateway.getAccountRSELimits(request.account, request.rucioAuthToken);
        if(accountLimitsDTO.status === 'error') {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: accountLimitsDTO.errorCode || 500,
                message: accountLimitsDTO.errorMessage || 'Could not fetch or process the fetched data',
                error: accountLimitsDTO.errorName || 'UseCase Error',
                name: accountLimitsDTO.errorName || 'UseCase Error',
            }
            return errorModel;
        }

        for(let rseName in accountLimitsDTO.limits) {
            const limit = accountLimitsDTO.limits[rseName];
            this.accountRSEUsageAndLimits[rseName] = {
                limit: limit,
                bytesRemaining: undefined,
            }
        }

        const listAccountUsageDTO = await this.accountGateway.listAccountRSEUsage(request.account, request.rucioAuthToken);
        if(listAccountUsageDTO.status === 'error') {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: listAccountUsageDTO.errorCode || 500,
                message: listAccountUsageDTO.errorMessage || 'Could not fetch or process the fetched data',
                error: listAccountUsageDTO.errorName || 'UseCase Error',
                name: listAccountUsageDTO.errorName || 'UseCase Error',
            }
            return errorModel;
        }
        if(listAccountUsageDTO.stream === undefined || listAccountUsageDTO.stream === null) {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: 500,
                message: 'Could not get the stream or process the fetched data ( ListAccountUsageDTO )',
                error: 'UseCase Error',
                name: 'UseCase Error',
            }
            return errorModel;
        }

        const accountUsageDTOs: AccountRSEUsageDTO[] = await collectStreamedData<AccountRSEUsageDTO>(listAccountUsageDTO.stream)

        accountUsageDTOs.forEach((accountUsageDTO: AccountRSEUsageDTO) => {
            const rseName: string = accountUsageDTO.rse;
            if(!this.accountRSEUsageAndLimits[rseName]) {
                this.accountRSEUsageAndLimits[rseName] = {
                    limit: undefined,
                    bytesRemaining: accountUsageDTO.bytes_limit - accountUsageDTO.used_bytes,
                }
            } else {
                this.accountRSEUsageAndLimits[rseName].bytesRemaining = accountUsageDTO.bytes_limit - accountUsageDTO.used_bytes;
            }
        })
        
        request.requestedDIDs.forEach((did: DIDLong) => {
            this.totalDIDBytesRequested += did.bytes;
        })
    }

    async generateSourceStream(requestModel: AuthenticatedRequestModel<AuthenticatedRequestModel<ListAccountRSEQuotasRequest>>): Promise<{ status: "success" | "error"; stream?: Transform | Readable | PassThrough | null | undefined; error?: ListAccountRSEQuotasError | undefined; }> {
        const listRSEDTO: ListRSEsDTO = await this.rseGateway.listRSEs(requestModel.rucioAuthToken, '');
        if(listRSEDTO.status === 'error') {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: listRSEDTO.errorCode || 500,
                message: listRSEDTO.errorMessage || 'Could not fetch or process the fetched data',
                error: listRSEDTO.errorName || 'UseCase Error',
                name: listRSEDTO.errorName || 'UseCase Error',
            }
            return {
                status: 'error',
                error: errorModel,
            }
        }
        if(listRSEDTO.stream === undefined || listRSEDTO.stream === null) {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: 500,
                message: 'Could not get the stream or process the fetched data',
                error: 'UseCase Error',
                name: 'UseCase Error',
            }
            return {
                status: 'error',
                error: errorModel,
            }
        } else {
            return {
                status: 'success',
                stream: listRSEDTO.stream,
            }
        }
    }

    processStreamedData(rse: RSEDTO): { data: ListAccountRSEQuotasResponse | ListAccountRSEQuotasError; status: "success" | "error"; } {
        const rseName = rse.name;
        if(!this.accountRSEUsageAndLimits[rseName]) {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: 500,
                message: `Could not get usage and quota for ${rseName}`,
                error: 'UseCase Stream Error',
                name: 'UseCase Stream Error',
            }
            return {
                status: 'error',
                data: errorModel,
            }
        }
        const accountRSEUsageAndLimit = this.accountRSEUsageAndLimits[rseName];
        
        let bytesLimit = accountRSEUsageAndLimit.limit;
        if(bytesLimit === undefined) {
            const errorModel: ListAccountRSEQuotasError = {
                status: 'error',
                code: 500,
                message: `Could not get usage and quota for ${rseName}. Account has no limits specified!`,
                error: 'UseCase Stream Error',
                name: 'UseCase Stream Error',
            }
            return {
                status: 'error',
                data: errorModel,
            }
        }

        if(bytesLimit === -1) {
            bytesLimit = Infinity;
        }

        if(bytesLimit < 0) {
            bytesLimit = 0;
        }

        let bytesRemaining = accountRSEUsageAndLimit.bytesRemaining? accountRSEUsageAndLimit.bytesRemaining : 0;

        let bytesUsed = bytesLimit - bytesRemaining;
        
        const totalExpectedUsage = this.totalDIDBytesRequested + bytesUsed;

        let hasQuota = bytesLimit <= totalExpectedUsage;

        if(bytesRemaining < 0) {
            bytesRemaining = 0;
        }

        if(bytesUsed < 0) {
            bytesUsed = 0;
        }

        if(bytesLimit === Infinity) {
            bytesLimit = Infinity
            bytesRemaining = Infinity;
            hasQuota = true;
        }


        const response: ListAccountRSEQuotasResponse = {
            status: 'success',
            rse_id: rse.id,
            rse: rse.name,
            account: this.account,
            files: -1, // does not matter for this use case
            used_bytes: bytesUsed,
            bytes_limit: bytesLimit,
        }

        return {
            status: 'success',
            data: response,
        }
    }
}