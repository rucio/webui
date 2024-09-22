import { BaseStreamableDTO } from '@/lib/sdk/dto';
import { ListRulesDTO, RuleDTO } from '../../dto/rule-dto';
import { ListRulesFilter } from '@/lib/infrastructure/gateway/rule-gateway/rule-gateway-utils';

export default interface RuleGatewayOutputPort {
    /**
     * Gets the details of the given Rule from Rucio.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param ruleId The rule to get.
     */
    getRule(rucioAuthToken: string, ruleId: string): Promise<RuleDTO>;

    /**
     * Lists all rules for a given account.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param filters An object containing filter parameters for the rules.
     */
    listRules(rucioAuthToken: string, filters?: ListRulesFilter): Promise<ListRulesDTO>;

    /**
     * Lists all locks for a given rule.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param ruleId The rule to list locks for.
     */
    listRuleReplicaLockStates(rucioAuthToken: string, ruleId: string): Promise<BaseStreamableDTO>;
}
