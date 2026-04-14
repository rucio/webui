import { RuleExtendedDTO } from '@/lib/core/dto/rule-dto';
import { BaseStreamableDTO } from '@/lib/sdk/dto';
import { BaseStreamableEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { convertRuleState, convertToRuleExtendedDTO, formatFilterDate, ListRulesFilter, TRucioRule } from '../rule-gateway-utils';
import { RuleState } from '@/lib/core/entity/rucio';

const DEFAULT_PARAMETER = '*';

/**
 * Endpoint for listing rules pending approval with extended metadata (did_type, grouping, comments, bytes).
 * Uses the same Rucio `/rules/` API as ListRulesEndpoint but maps to RuleExtendedDTO.
 */
export default class ListRulesPendingApprovalEndpoint extends BaseStreamableEndpoint<BaseStreamableDTO, RuleExtendedDTO> {
    private readonly ruleFilter?: ListRulesFilter;

    constructor(private readonly rucioAuthToken: string, ruleFilter?: ListRulesFilter) {
        super(true);
        this.ruleFilter = ruleFilter;
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/rules/`;

        const params: any = {
            account: this.ruleFilter?.account ?? DEFAULT_PARAMETER,
            scope: this.ruleFilter?.scope ?? DEFAULT_PARAMETER,
            state: convertRuleState(RuleState.WAITING_APPROVAL),
        };

        if (this.ruleFilter?.activity) {
            params.activity = this.ruleFilter.activity;
        }
        if (this.ruleFilter?.updated_after) {
            params.updated_after = formatFilterDate(this.ruleFilter.updated_after);
        }
        if (this.ruleFilter?.updated_before) {
            params.updated_before = formatFilterDate(this.ruleFilter.updated_before);
        }
        if (this.ruleFilter?.state) {
            const ruleFilter = convertRuleState(this.ruleFilter.state);
            if (ruleFilter) {
                params.state = ruleFilter;
            }
        }
        if (this.ruleFilter?.name) {
            params.name = this.ruleFilter.name;
        }

        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            params: params,
        };
        this.request = request;
        this.initialized = true;
    }

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

    createDTO(response: Buffer): RuleExtendedDTO {
        const data: TRucioRule = JSON.parse(JSON.parse(response.toString()));
        const dto: RuleExtendedDTO = convertToRuleExtendedDTO(data);
        return dto;
    }
}
