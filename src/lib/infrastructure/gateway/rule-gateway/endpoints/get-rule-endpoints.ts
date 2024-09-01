import { RuleDTO } from '@/lib/core/dto/rule-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { convertToRuleDTO, getEmptyRuleDTO, TRucioRule } from '../rule-gateway-utils';
import { Response } from 'node-fetch';

export default class GetRuleEndpoint extends BaseEndpoint<RuleDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly ruleId: string) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/rules/${this.ruleId}`;
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

    /**
     * If this method is called, it means that the response from Rucio was not in any of the error types in ${@link handleCommonGatewayEndpointErrors}
     * @param statusCode The status code returned from Rucio
     * @param response The reponse containing error data
     * @returns
     */
    async reportErrors(statusCode: number, response: Response): Promise<RuleDTO | undefined> {
        const data = await response.json();
        const errorDTO: RuleDTO = {
            ...getEmptyRuleDTO(),
            status: 'error',
            errorMessage: data,
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway-endpoint-error',
        };
        return Promise.resolve(errorDTO);
    }

    /**
     * Converts stream elements into RSEDTO objects
     * @param response The individual RSE object streamed from Rucio
     * @returns The RSEDTO object
     */
    createDTO(data: TRucioRule): RuleDTO {
        const dto: RuleDTO = convertToRuleDTO(data);
        return dto;
    }
}
