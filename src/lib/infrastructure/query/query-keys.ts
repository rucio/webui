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
} as const;
