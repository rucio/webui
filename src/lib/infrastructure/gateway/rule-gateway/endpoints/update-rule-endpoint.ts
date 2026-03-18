import { UpdateRuleDTO } from '@/lib/core/dto/rule-dto';
import { RuleUpdateOptions } from '@/lib/core/entity/rucio';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

export default class UpdateRuleEndpoint extends BaseEndpoint<UpdateRuleDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly ruleId: string,
        private readonly options: RuleUpdateOptions,
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/rules/${this.ruleId}`;
        const request: HTTPRequest = {
            method: 'PUT',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: { options: this.options },
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<UpdateRuleDTO | undefined> {
        const errorDetails = await extractErrorMessage(response);
        const errorDTO: UpdateRuleDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(data: object | string): UpdateRuleDTO {
        return {
            status: 'success',
        };
    }
}
