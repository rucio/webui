import { accountKeys, QUERY_KEYS } from './query-keys';

type AccountVars = { account: string };

/**
 * An entry is either a fixed query key or a function that builds one from the
 * mutation variables passed to `invalidateForMutation`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InvalidationEntry = readonly unknown[] | ((vars: any) => readonly unknown[]);

/**
 * Maps mutation names to the query keys they should invalidate on success.
 * Used by `invalidateForMutation` to keep invalidation logic centralized
 * and discoverable: you can see at a glance what each mutation refreshes.
 *
 * Add entries here when creating new mutations.
 */
export const INVALIDATION_MAP: Record<string, readonly InvalidationEntry[]> = {
    'update-rule': [QUERY_KEYS.RULE_META, QUERY_KEYS.RULE_PAGE],
    'delete-rule': [QUERY_KEYS.RULE_META],

    // Account mutations. The accounts list is streamed, not cached, so there is no list key.
    // create-account: the page navigates to the new account, nothing is cached yet.
    'create-account': [],
    // Reactivate turns the identity, attribute and quota queries back on, so refresh the whole account.
    // Suspend refreshes only the info query: the sub-resource queries are still enabled until the new
    // status arrives, and Rucio answers 404 for them once the account is suspended. The detail page
    // removes them from the cache after the info refetch instead. Email and type changes only touch info.
    'update-account': [
        (vars: AccountVars & { options: { status?: string } }) =>
            vars.options.status === 'ACTIVE' ? accountKeys.detail(vars.account) : accountKeys.info(vars.account),
    ],
    // delete-account: the page calls queryClient.removeQueries(accountKeys.detail(a)) before navigating away,
    // which avoids refetching the deleted account (and a flash of 404), so there is nothing to invalidate.
    'delete-account': [],
    'add-account-attribute': [(vars: AccountVars) => accountKeys.attributes(vars.account)],
    'delete-account-attribute': [(vars: AccountVars) => accountKeys.attributes(vars.account)],
    'add-account-identity': [(vars: AccountVars) => accountKeys.identities(vars.account)],
    'delete-account-identity': [(vars: AccountVars) => accountKeys.identities(vars.account)],
    'set-account-limit': [(vars: AccountVars) => accountKeys.quotas(vars.account)],
    'delete-account-limit': [(vars: AccountVars) => accountKeys.quotas(vars.account)],
};
