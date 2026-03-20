import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { UpdateRuleError, UpdateRuleRequest, UpdateRuleResponse } from '@/lib/core/usecase-models/update-rule-usecase-models';
import { UpdateRuleInputPort, type UpdateRuleOutputPort } from '@/lib/core/port/primary/update-rule-ports';

import { UpdateRuleDTO } from '@/lib/core/dto/rule-dto';
import type RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';

@injectable()
export default class UpdateRuleUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<UpdateRuleRequest>, UpdateRuleResponse, UpdateRuleError, UpdateRuleDTO>
    implements UpdateRuleInputPort
{
    constructor(protected readonly presenter: UpdateRuleOutputPort, private readonly gateway: RuleGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<UpdateRuleRequest>): UpdateRuleError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<UpdateRuleRequest>): Promise<UpdateRuleDTO> {
        const { rucioAuthToken, ruleId, options } = requestModel;
        const dto: UpdateRuleDTO = await this.gateway.updateRule(rucioAuthToken, ruleId, options);
        return dto;
    }

    handleGatewayError(error: UpdateRuleDTO): UpdateRuleError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as UpdateRuleError;
    }

    processDTO(dto: UpdateRuleDTO): { data: UpdateRuleResponse | UpdateRuleError; status: 'success' | 'error' } {
        const responseModel: UpdateRuleResponse = {
            ...dto,
            status: 'success',
        };

        return {
            status: 'success',
            data: responseModel,
        };
    }
}
