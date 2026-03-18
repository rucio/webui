import { RuleAnalysisDTO } from '@/lib/core/dto/rule-dto';
import { RuleAnalysis } from '@/lib/core/entity/rucio';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

export default class ExamineRuleEndpoint extends BaseEndpoint<RuleAnalysisDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly ruleId: string,
    ) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/rules/${this.ruleId}/analysis`;
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<RuleAnalysisDTO | undefined> {
        const errorDetails = await extractErrorMessage(response);
        const errorDTO: RuleAnalysisDTO = {
            status: 'error',
            rule_error: '',
            transfers: [],
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(data: RuleAnalysis): RuleAnalysisDTO {
        return {
            status: 'success',
            rule_error: data.rule_error,
            transfers: data.transfers ?? [],
        };
    }
}
