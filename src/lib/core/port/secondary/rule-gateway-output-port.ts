import { BaseStreamableDTO } from "@/lib/sdk/dto";
import { RuleDTO } from "../../dto/rule-dto";

export default interface RuleGatewayOutputPort {

    /**
     * Gets the details of the given Rule from Rucio.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param ruleId The rule to get.
     */
    getRule(rucioAuthToken: string, ruleId: string): Promise<RuleDTO>

    /**
     * Lists all rules for a given account.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param account The account to list rules for.
     */
    listRules(rucioAuthToken: string, account?: string): Promise<BaseStreamableDTO>

    /**
     * Lists all locks for a given rule.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param ruleId The rule to list locks for.
     */
    listRuleReplicaLockStates(rucioAuthToken: string, ruleId: string): Promise<BaseStreamableDTO>

}