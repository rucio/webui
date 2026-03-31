import { BaseStreamableDTO } from '@/lib/sdk/dto';
import { CreateRuleDTO, DeleteRuleDTO, ListRulesDTO, RuleAnalysisDTO, RuleDTO, RuleExtendedDTO, RuleMetaDTO, UpdateRuleDTO } from '../../dto/rule-dto';
import { ListRulesFilter } from '@/lib/infrastructure/gateway/rule-gateway/rule-gateway-utils';
import { RuleCreationParameters, RuleUpdateOptions } from '@/lib/core/entity/rucio';

export default interface RuleGatewayOutputPort {
    /**
     * Gets the details of the given Rule from Rucio.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param ruleId The rule to get.
     */
    getRule(rucioAuthToken: string, ruleId: string): Promise<RuleMetaDTO>;

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

    /**
     * Create a new rule.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param params An object containing parameters for rule creation.
     */
    createRule(rucioAuthToken: string, params: RuleCreationParameters): Promise<CreateRuleDTO>;

    /**
     * Update a replication rule's options (lifetime, approve/deny, priority).
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param ruleId The rule to update.
     * @param options The options to update on the rule.
     */
    updateRule(rucioAuthToken: string, ruleId: string, options: RuleUpdateOptions): Promise<UpdateRuleDTO>;

    /**
     * Delete a replication rule by its ID.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param ruleId The rule to delete.
     */
    deleteRule(rucioAuthToken: string, ruleId: string): Promise<DeleteRuleDTO>;

    /**
     * Lists rules pending approval with extended metadata (did_type, grouping, comments, bytes).
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param filters An object containing filter parameters for the rules.
     */
    listRulesPendingApproval(rucioAuthToken: string, filters?: ListRulesFilter): Promise<ListRulesDTO>;

    /**
     * Examine/analyze a rule to get details about stuck transfers.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param ruleId The rule to examine.
     */
    examineRule(rucioAuthToken: string, ruleId: string): Promise<RuleAnalysisDTO>;
}
