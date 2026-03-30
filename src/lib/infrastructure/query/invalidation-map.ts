import { QUERY_KEYS } from './query-keys';

/**
 * Maps mutation names to the query keys they should invalidate on success.
 * Used by `invalidateForMutation` to keep invalidation logic centralized
 * and discoverable — you can see at a glance what each mutation refreshes.
 *
 * Add entries here when creating new mutations.
 */
export const INVALIDATION_MAP: Record<string, readonly (readonly string[])[]> = {
    'update-rule': [QUERY_KEYS.RULE_META, QUERY_KEYS.RULE_PAGE],
    'delete-rule': [QUERY_KEYS.RULE_META],
};
