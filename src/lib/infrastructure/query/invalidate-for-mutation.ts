import { QueryClient } from '@tanstack/react-query';
import { INVALIDATION_MAP } from './invalidation-map';

/**
 * Invalidates all queries associated with a mutation.
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
export function invalidateForMutation(queryClient: QueryClient, mutationName: string) {
    const queryKeys = INVALIDATION_MAP[mutationName];
    if (!queryKeys) return;

    queryKeys.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [...queryKey] });
    });
}
