import { CreateRuleDTO, ListLocksDTO, ListRulesDTO, RuleMetaDTO } from '@/lib/core/dto/rule-dto';
import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import { BaseStreamableDTO } from '@/lib/sdk/dto';
import { injectable } from 'inversify';
import GetRuleEndpoint from './endpoints/get-rule-endpoints';
import ListRuleReplicaLockStatesEndpoint from './endpoints/list-rule-replica-lock-states-endpoint';
import ListRulesEndpoint from './endpoints/list-rules-endpoint';
import { ListRulesFilter } from '@/lib/infrastructure/gateway/rule-gateway/rule-gateway-utils';
import { RuleCreationParameters } from '@/lib/core/entity/rucio';
import CreateRuleEndpoint from '@/lib/infrastructure/gateway/rule-gateway/endpoints/create-rule-endpoint';

@injectable()
export default class RuleGateway implements RuleGatewayOutputPort {
    async getRule(rucioAuthToken: string, ruleId: string): Promise<RuleMetaDTO> {
        const endpoint = new GetRuleEndpoint(rucioAuthToken, ruleId);
        const dto = await endpoint.fetch();
        return dto;
    }

    async listRules(rucioAuthToken: string, filter?: ListRulesFilter): Promise<ListRulesDTO> {
        try {
            const endpoint = new ListRulesEndpoint(rucioAuthToken, filter);
            const errorDTO: BaseStreamableDTO | undefined = await endpoint.fetch();
            if (!errorDTO) {
                return {
                    status: 'success',
                    stream: endpoint,
                };
            }
            return errorDTO;
        } catch (error) {
            const errorDTO: BaseStreamableDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching rules',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            };
            return Promise.resolve(errorDTO);
        }
    }

    async listRuleReplicaLockStates(rucioAuthToken: string, ruleId: string): Promise<ListLocksDTO> {
        try {
            const endpoint = new ListRuleReplicaLockStatesEndpoint(rucioAuthToken, ruleId);
            const errorDTO: BaseStreamableDTO | undefined = await endpoint.fetch();
            if (!errorDTO) {
                return {
                    status: 'success',
                    stream: endpoint,
                };
            }
            return errorDTO;
        } catch (error) {
            const errorDTO: BaseStreamableDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching rule replica locks',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            };
            return Promise.resolve(errorDTO);
        }
    }

    async createRule(rucioAuthToken: string, params: RuleCreationParameters): Promise<CreateRuleDTO> {
        const endpoint = new CreateRuleEndpoint(rucioAuthToken, params);
        const dto = await endpoint.fetch();
        return dto;
    }
}
