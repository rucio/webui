import { DeleteRuleDTO } from '@/lib/core/dto/rule-dto';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

export default class DeleteRuleEndpoint extends BaseEndpoint<DeleteRuleDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly ruleId: string,
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/rules/${this.ruleId}`;
        const request: HTTPRequest = {
            method: 'DELETE',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: {},
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<DeleteRuleDTO | undefined> {
        const errorDetails = await extractErrorMessage(response);
        const errorDTO: DeleteRuleDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(data: object | string): DeleteRuleDTO {
        return {
            status: 'success',
        };
    }
}
