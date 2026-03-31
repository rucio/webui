import { injectable } from 'inversify';
import { BaseSingleEndpointPostProcessingPipelineStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    ListRulesPendingApprovalError,
    ListRulesPendingApprovalRequest,
    ListRulesPendingApprovalResponse,
} from '@/lib/core/usecase-models/list-rules-pending-approval-usecase-models';
import {
    ListRulesPendingApprovalInputPort,
    type ListRulesPendingApprovalOutputPort,
} from '@/lib/core/port/primary/list-rules-pending-approval-ports';

import { ListRulesDTO, RuleExtendedDTO } from '@/lib/core/dto/rule-dto';
import type RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import type DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { ApproveRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { RuleGrouping, DIDType } from '@/lib/core/entity/rucio';
import GetDIDForRulePipelineElement from './pipeline-element-get-did';

@injectable()
export default class ListRulesPendingApprovalUseCase
    extends BaseSingleEndpointPostProcessingPipelineStreamingUseCase<
        ListRulesPendingApprovalRequest,
        ListRulesPendingApprovalResponse,
        ListRulesPendingApprovalError,
        ListRulesDTO,
        RuleExtendedDTO,
        ApproveRuleViewModel
    >
    implements ListRulesPendingApprovalInputPort
{
    constructor(
        protected readonly presenter: ListRulesPendingApprovalOutputPort,
        private readonly ruleGateway: RuleGatewayOutputPort,
        private readonly didGateway: DIDGatewayOutputPort,
    ) {
        const getDIDPipelineElement = new GetDIDForRulePipelineElement(didGateway);
        super(presenter, [getDIDPipelineElement]);
    }

    validateRequestModel(
        requestModel: AuthenticatedRequestModel<ListRulesPendingApprovalRequest>,
    ): ListRulesPendingApprovalError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListRulesPendingApprovalRequest>): Promise<ListRulesDTO> {
        const { rucioAuthToken, filters } = requestModel;
        const dto: ListRulesDTO = await this.ruleGateway.listRulesPendingApproval(rucioAuthToken, filters);
        return dto;
    }

    handleGatewayError(error: RuleExtendedDTO): ListRulesPendingApprovalError {
        return {
            status: 'error',
            error: `Gateway returned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: 'Gateway Error',
            code: error.errorCode ?? 500,
        };
    }

    processStreamedData(
        dto: RuleExtendedDTO,
    ): { data: ListRulesPendingApprovalResponse | ListRulesPendingApprovalError; status: 'success' | 'error' } {
        if (dto.status === 'error') {
            const errorModel: ListRulesPendingApprovalError = {
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

        const responseModel: ListRulesPendingApprovalResponse = {
            ...dto,
            status: 'success',
            // length and open will be populated by the GetDID pipeline element
            length: 0,
            open: false,
        };
        return {
            status: 'success',
            data: responseModel,
        };
    }

    validateFinalResponseModel(responseModel: ListRulesPendingApprovalResponse): {
        isValid: boolean;
        errorModel?: ListRulesPendingApprovalError | undefined;
    } {
        return {
            isValid: true,
        };
    }

    intializeRequest(
        request: AuthenticatedRequestModel<AuthenticatedRequestModel<ListRulesPendingApprovalRequest>>,
    ): Promise<undefined | ListRulesPendingApprovalError> {
        return Promise.resolve(undefined);
    }
}
