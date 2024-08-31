import { RuleDTO } from "@/lib/core/dto/rule-dto";
import RuleGatewayOutputPort from "@/lib/core/port/secondary/rule-gateway-output-port";
import { BaseStreamableDTO } from "@/lib/sdk/dto";
import { injectable } from "inversify";
import GetRuleEndpoint from "./endpoints/get-rule-endpoints";
import ListRuleReplicaLockStatesEndpoint from "./endpoints/list-rule-replica-lock-states-endpoint";
import ListRulesEndpoint from "./endpoints/list-rules-endpoint";
import {ListRulesFilter} from "@/lib/infrastructure/gateway/rule-gateway/rule-gateway-utils";

@injectable()
export default class RuleGateway implements RuleGatewayOutputPort {
    async getRule(rucioAuthToken: string, ruleId: string): Promise<RuleDTO> {
        const endpoint = new GetRuleEndpoint(rucioAuthToken, ruleId)
        const dto = await endpoint.fetch()
        return dto
    }

    async listRules(rucioAuthToken: string, filter?: ListRulesFilter): Promise<BaseStreamableDTO> {
        try {
            const endpoint = new ListRulesEndpoint(rucioAuthToken, filter)
            const errorDTO: BaseStreamableDTO | undefined = await endpoint.fetch()
            if(!errorDTO) {
                return {
                    status: 'success',
                    stream: endpoint
                }
            }
            return errorDTO
        }catch(error) {
            const errorDTO: BaseStreamableDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching rules',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            }
            return Promise.resolve(errorDTO)
        }
    }


    async listRuleReplicaLockStates(rucioAuthToken: string, ruleId: string): Promise<BaseStreamableDTO> {
        try {
            const endpoint = new ListRuleReplicaLockStatesEndpoint(rucioAuthToken, ruleId)
            const errorDTO: BaseStreamableDTO | undefined = await endpoint.fetch()
            if(!errorDTO) {
                return {
                    status: 'success',
                    stream: endpoint
                }
            }
            return errorDTO
        } catch(error) {
            const errorDTO: BaseStreamableDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching rule replica locks',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            }
            return Promise.resolve(errorDTO)
        }
    }
    
}