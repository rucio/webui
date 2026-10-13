import { QueryClient } from '@tanstack/react-query';
import { INVALIDATION_MAP } from './invalidation-map';

/**
 * Invalidates all queries associated with a mutation.
 * Function entries in the map receive `vars` (the mutation variables) to scope the key.
 * Call this in `useMutation.onSuccess` to keep the UI fresh.
 *
 * @example
 * ```ts
 * const queryClient = useQueryClient();
 * const { mutate } = useMutation({
 *     mutationFn: ...,
 *     onSuccess: () => invalidateForMutation(queryClient, 'update-rule'),
 * });
 * ```
 */
export function invalidateForMutation(queryClient: QueryClient, mutationName: string, vars?: unknown) {
    const entries = INVALIDATION_MAP[mutationName];
    if (!entries) return;

    entries.forEach(entry => {
        const queryKey = typeof entry === 'function' ? entry(vars) : entry;
        queryClient.invalidateQueries({ queryKey: [...queryKey] });
    });
}
