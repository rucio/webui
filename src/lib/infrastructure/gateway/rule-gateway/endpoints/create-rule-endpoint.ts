import { CreateRuleDTO } from '@/lib/core/dto/rule-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';
import { RuleCreationParameters } from '@/lib/core/entity/rucio';

export default class CreateRuleEndpoint extends BaseEndpoint<CreateRuleDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly params: RuleCreationParameters) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/rules/`;
        const request: HTTPRequest = {
            method: 'POST',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: this.params,
        };
        this.request = request;
        this.initialized = true;
    }

    /**
     * If this method is called, it means that the response from Rucio was not in any of the error types in ${@link handleCommonGatewayEndpointErrors}
     * @param statusCode The status code returned from Rucio
     * @param response The reponse containing error data
     * @returns
     */
    async reportErrors(statusCode: number, response: Response): Promise<CreateRuleDTO | undefined> {
        const data = await response.json();
        const errorDTO: CreateRuleDTO = {
            rule_ids: [],
            status: 'error',
            errorMessage: data,
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway-endpoint-error',
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(data: string[]): CreateRuleDTO {
        const dto: CreateRuleDTO = {
            status: 'success',
            rule_ids: data,
        };
        return dto;
    }
}
