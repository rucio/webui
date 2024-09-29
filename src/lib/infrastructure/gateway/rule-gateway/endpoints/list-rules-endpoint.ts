import {RuleDTO} from '@/lib/core/dto/rule-dto';
import {BaseStreamableDTO} from '@/lib/sdk/dto';
import {BaseStreamableEndpoint} from '@/lib/sdk/gateway-endpoints';
import {HTTPRequest} from '@/lib/sdk/http';
import {Response} from 'node-fetch';
import {convertToRuleDTO, ListRulesFilter, TRucioRule} from '../rule-gateway-utils';

const DEFAULT_PARAMETER = '*';

/**
 * Endpoint for listing rules with an optional filter
 */
export default class ListRulesEndpoint extends BaseStreamableEndpoint<BaseStreamableDTO, RuleDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly filter?: ListRulesFilter) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/rules/`;
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            params: {
                account: this.filter?.account ?? DEFAULT_PARAMETER,
                scope: this.filter?.scope ?? DEFAULT_PARAMETER,
            }
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
    async reportErrors(statusCode: number, response: Response): Promise<BaseStreamableDTO | undefined> {
        const data = await response.json();
        const errorDTO: BaseStreamableDTO = {
            status: 'error',
            errorMessage: data,
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway-endpoint-error',
            stream: null,
        };
        return Promise.resolve(errorDTO);
    }

    /**
     * Converts stream elements into RSEDTO objects
     * @param response The individual RSE object streamed from Rucio
     * @returns The RSEDTO object
     */

    createDTO(response: Buffer): RuleDTO {
        const data: TRucioRule = JSON.parse(JSON.parse(response.toString()));
        const dto: RuleDTO = convertToRuleDTO(data);
        return dto;
    }
}
