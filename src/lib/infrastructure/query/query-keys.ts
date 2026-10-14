/**
 * Centralized query key registry.
 * All React Query keys should be defined here so mutations can
 * reference them for invalidation without duplicating strings.
 *
 * Convention: each key is a function that returns a tuple.
 * Parameterized keys allow targeted invalidation (e.g., a specific rule).
 * Calling with no args returns the base key, which invalidates ALL queries
 * in that family via React Query's prefix matching.
 */
export const QUERY_KEYS = {
    /** Rule detail metadata — used by DetailsRule page */
    RULE_META: ['rule-meta'] as const,

    /** Rule replica lock states — used by DetailsRuleLocks */
    RULE_LOCKS: ['rule-locks'] as const,

    /** Paginated/streamed rule list — used by ListRule page */
    RULE_PAGE: ['rule-page'] as const,

    /** AMI tag info for a DID's tags (ATLAS only) — used by AMITagsRow */
    AMI_TAG_INFO: ['ami-tag-info'] as const,

    /** BigPanDA link for a DID's PanDA task (ATLAS only), used by PandaTaskRow */
    PANDA_TASK_LINK: ['panda-task-link'] as const,

    /** Names of every RSE, loaded when the account quota dialog opens */
    RSE_NAMES: ['rse-names'] as const,

    /** Root of every account query (info, attributes, identities, quotas); see `accountKeys` */
    ACCOUNT: ['account'] as const,
} as const;

/**
 * Account query keys. They nest, so React Query prefix matching gives the scopes:
 * `detail(a)` covers all of one account's data, `all` covers every account.
 */
export const accountKeys = {
    all: QUERY_KEYS.ACCOUNT,
    detail: (account: string) => [...QUERY_KEYS.ACCOUNT, account] as const,
    info: (account: string) => [...QUERY_KEYS.ACCOUNT, account, 'info'] as const,
    attributes: (account: string) => [...QUERY_KEYS.ACCOUNT, account, 'attributes'] as const,
    identities: (account: string) => [...QUERY_KEYS.ACCOUNT, account, 'identities'] as const,
    quotas: (account: string) => [...QUERY_KEYS.ACCOUNT, account, 'quotas'] as const,
};
