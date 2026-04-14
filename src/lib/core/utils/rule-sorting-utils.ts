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

/**
 * Comparator function for ag-Grid that sorts remaining_lifetime values numerically
 * The field stores time in seconds, which gets formatted as "X days, Y hours" for display
 * This ensures proper numeric sorting instead of alphanumeric
 */
export function remainingLifetimeComparator(valueA: number | null | undefined, valueB: number | null | undefined): number {
    // Handle null/undefined values - place them at the end
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    // Numeric comparison (values are in seconds)
    return valueA - valueB;
}

/**
 * Get priority score for lock states
 * Higher scores indicate higher priority (more urgent states)
 */
function getLockStatePriority(state: string): number {
    const stateLower = state.toLowerCase();

    if (stateLower.includes('error')) return 4;
    if (stateLower === 'stuck') return 3;
    if (stateLower === 'replicating') return 2;
    if (stateLower === 'ok') return 1;
    return 0; // unknown or other states
}

/**
 * Comparator function for ag-Grid that sorts lock states by priority
 * Order: ERROR > STUCK > REPLICATING > OK > UNKNOWN
 */
export function lockStateComparator(valueA: string, valueB: string): number {
    const priorityA = getLockStatePriority(valueA);
    const priorityB = getLockStatePriority(valueB);

    // Higher priority first
    return priorityB - priorityA;
}

/**
 * Get priority score for rule states
 * Higher scores indicate higher priority (more urgent states)
 */
function getRuleStatePriority(state: string): number {
    const stateLower = state.toLowerCase();

    if (stateLower === 'stuck') return 6;
    if (stateLower === 'suspended') return 5;
    if (stateLower === 'replicating') return 4;
    if (stateLower === 'waiting_approval') return 3;
    if (stateLower === 'inject') return 2;
    if (stateLower === 'ok') return 1;
    return 0; // unknown or other states
}

/**
 * Comparator function for ag-Grid that sorts rule states by priority
 * Order: STUCK > SUSPENDED > REPLICATING > WAITING_APPROVAL > INJECT > OK > UNKNOWN
 */
export function ruleStateComparator(valueA: string, valueB: string): number {
    const priorityA = getRuleStatePriority(valueA);
    const priorityB = getRuleStatePriority(valueB);

    // Higher priority first
    return priorityB - priorityA;
}
