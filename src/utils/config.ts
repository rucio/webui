export const AccountConfig = {
    endpoints: {
        accounts: '/accounts',
        account: '/accounts/{account}',
        attribute: '/accounts/{account}/attr/{key}',
        scope: '/accounts/{account}/scopes/{scope}',
        limit: '/accounts/{account}/limits',
        identities: '/accounts/{account}/identities',
        rules: '/accounts/{account}/rules',
        usage_history: 'accounts/{account}/usage/history',
    },
}

export const RuleConfig = {
    endpoints: {
        rules: '/rules',
        rule: '/rules/{rule_id}',
        locks: '/rules/{rule_id}/locks',
        reduce: '/rules/{rule_id}/reduce',
        move: '/rules/{rule_id}/move',
        history: '/rules/{rule_id}/history',
        did_history: '/rules/{scope_name}/history',
        analysis: '/rules/{rule_id}/analysis',
    },
}

export const AuthConfig = {
    endpoints: {
        userpass: '/auth/userpass',
    },
}

export const DidConfig = {
    endpoints: {
        did: '/dids/{scope_name}',
        metadata: '/dids/{scope_name}/meta',
    },
}

export const RSEConfig = {
    endpoints: {
        rses: '/rses',
        usage: '/rses/{rse}/accounts/usage',
    },
}
