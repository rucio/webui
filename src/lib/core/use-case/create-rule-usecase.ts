import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { CreateRuleError, CreateRuleRequest, CreateRuleResponse } from '@/lib/core/usecase-models/create-rule-usecase-models';
import { CreateRuleInputPort, type CreateRuleOutputPort } from '@/lib/core/port/primary/create-rule-ports';

import { CreateRuleDTO } from '@/lib/core/dto/rule-dto';
import type RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';

@injectable()
export default class CreateRuleUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<CreateRuleRequest>, CreateRuleResponse, CreateRuleError, CreateRuleDTO>
    implements CreateRuleInputPort
{
    constructor(protected readonly presenter: CreateRuleOutputPort, private readonly gateway: RuleGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<CreateRuleRequest>): CreateRuleError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<CreateRuleRequest>): Promise<CreateRuleDTO> {
        const { rucioAuthToken, ...params } = requestModel;
        const dto: CreateRuleDTO = await this.gateway.createRule(rucioAuthToken, params);
        return dto;
    }

    handleGatewayError(error: CreateRuleDTO): CreateRuleError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as CreateRuleError;
    }

    processDTO(dto: CreateRuleDTO): { data: CreateRuleResponse | CreateRuleError; status: 'success' | 'error' } {
        return {
            status: 'success',
            data: {
                status: 'success',
                rule_ids: dto.rule_ids,
            },
        };
    }
}
