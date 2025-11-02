import { RuleState } from '@/lib/core/entity/rucio';

/**
 * Interface for rule data that can be sorted by activity
 */
export interface RuleWithActivity {
    locks_stuck_cnt: number;
    locks_replicating_cnt: number;
    state: RuleState | string;
}

/**
 * Calculate activity score for a rule based on stuck/replicating locks and state
 * Higher scores indicate higher priority (more urgent rules)
 */
export function calculateRuleActivityScore(rule: RuleWithActivity): number {
    let score = 0;

    // Priority 1: Rules with stuck locks (highest priority)
    if (rule.locks_stuck_cnt > 0) {
        score += 1000 + rule.locks_stuck_cnt;
    }

    // Priority 2: Rules with replicating locks
    if (rule.locks_replicating_cnt > 0) {
        score += 500 + rule.locks_replicating_cnt;
    }

    // Priority 3: Rules in stuck or replicating state
    if (rule.state === RuleState.STUCK || rule.state === 'Stuck') {
        score += 200;
    } else if (rule.state === RuleState.REPLICATING || rule.state === 'Replicating') {
        score += 100;
    }

    return score;
}

/**
 * Comparator function for ag-Grid that prioritizes rules with active issues
 * (stuck or replicating locks/states)
 */
export function ruleActivityComparator(valueA: number, valueB: number, nodeA: any, nodeB: any): number {
    const rowA = nodeA.data;
    const rowB = nodeB.data;

    const scoreA = calculateRuleActivityScore(rowA);
    const scoreB = calculateRuleActivityScore(rowB);

    // Higher scores first (more urgent rules)
    return scoreB - scoreA;
}

/**
 * Sort function for arrays of rules that prioritizes rules with active issues
 */
export function sortRulesByActivity<T extends RuleWithActivity>(rules: T[]): T[] {
    return rules.sort((a, b) => {
        const scoreA = calculateRuleActivityScore(a);
        const scoreB = calculateRuleActivityScore(b);

        // Higher scores first (more urgent rules)
        return scoreB - scoreA;
    });
}
