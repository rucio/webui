import { env } from '../util'

export const AccountConfig = {
    endpoints: {
        accounts: env('accounts') ?? '',
        account: env('account') ?? '',
        attribute: env('account_attribute') ?? '',
        scope: env('account_scope') ?? '',
        limit: env('account_limit') ?? '',
        identities: env('account_identities') ?? '',
        rules: env('account_rules') ?? '',
        usage_history: env('account_usage_history') ?? '',
    },
}

export const RuleConfig = {
    endpoints: {
        rules: env('rules') ?? '',
        rule: env('rule') ?? '',
        locks: env('rule_locks') ?? '',
        reduce: env('rule_reduce') ?? '',
        move: env('rule_move') ?? '',
        history: env('rule_history') ?? '',
        did_history: env('did_history') ?? '',
        analysis: env('rule_analysis') ?? '',
    },
}
