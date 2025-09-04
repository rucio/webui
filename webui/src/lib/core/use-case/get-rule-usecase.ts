import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { GetRuleError, GetRuleRequest, GetRuleResponse } from '@/lib/core/usecase-models/get-rule-usecase-models';
import { GetRuleInputPort, type GetRuleOutputPort } from '@/lib/core/port/primary/get-rule-ports';

import { RuleMetaDTO } from '@/lib/core/dto/rule-dto';
import type RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';

@injectable()
export default class GetRuleUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<GetRuleRequest>, GetRuleResponse, GetRuleError, RuleMetaDTO>
    implements GetRuleInputPort
{
    constructor(protected readonly presenter: GetRuleOutputPort, private readonly gateway: RuleGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<GetRuleRequest>): GetRuleError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetRuleRequest>): Promise<RuleMetaDTO> {
        const { rucioAuthToken, id } = requestModel;
        const dto: RuleMetaDTO = await this.gateway.getRule(rucioAuthToken, id);
        return dto;
    }
    handleGatewayError(error: RuleMetaDTO): GetRuleError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as GetRuleError;
    }

    processDTO(dto: RuleMetaDTO): { data: GetRuleResponse | GetRuleError; status: 'success' | 'error' } {
        const responseModel: GetRuleResponse = {
            ...dto,
            status: 'success',
        };

        return {
            status: 'success',
            data: responseModel,
        };
    }
}
