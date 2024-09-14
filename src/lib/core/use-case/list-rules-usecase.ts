import {injectable} from "inversify";
import {BaseSingleEndpointStreamingUseCase} from "@/lib/sdk/usecase"
import {AuthenticatedRequestModel} from "@/lib/sdk/usecase-models";

import {ListRulesError, ListRulesRequest, ListRulesResponse} from "@/lib/core/usecase-models/list-rules-usecase-models";
import {ListRulesInputPort, type ListRulesOutputPort} from "@/lib/core/port/primary/list-rules-ports";

import {ListRulesDTO, RuleDTO} from "@/lib/core/dto/rule-dto";
import type RuleGatewayOutputPort from "@/lib/core/port/secondary/rule-gateway-output-port";
import {RuleViewModel} from "@/lib/infrastructure/data/view-model/rule";

@injectable()
export default class ListRulesUseCase extends BaseSingleEndpointStreamingUseCase<AuthenticatedRequestModel<ListRulesRequest>, ListRulesResponse, ListRulesError, ListRulesDTO, RuleDTO, RuleViewModel> implements ListRulesInputPort {

    constructor(
        protected readonly presenter: ListRulesOutputPort,
        private readonly gateway: RuleGatewayOutputPort,
    ) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListRulesRequest>): ListRulesError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListRulesRequest>): Promise<ListRulesDTO> {
        const {rucioAuthToken, scope, account} = requestModel;
        const dto: ListRulesDTO = await this.gateway.listRules(rucioAuthToken, { scope, account });
        return dto;
    }

    handleGatewayError(error: RuleDTO): ListRulesError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListRulesError
    }

    processStreamedData(dto: RuleDTO): { data: ListRulesResponse | ListRulesError; status: "success" | "error"; } {
        if (dto.status === 'error') {
            const errorModel: ListRulesError = {
                status: 'error',
                code: dto.errorCode || 500,
                message: dto.errorMessage || 'Could not fetch or process the fetched data',
                name: dto.errorName || 'Gateway Error',
            }
            return {
                status: 'error',
                data: errorModel,
            }
        }

        const responseModel: ListRulesResponse = {
            ...dto,
            status: 'success',
        }
        return {
            status: 'success',
            data: responseModel,
        }
    }

    intializeRequest(request: AuthenticatedRequestModel<AuthenticatedRequestModel<ListRulesRequest>>): Promise<undefined | ListRulesError> {
        return Promise.resolve(undefined);
    }
}