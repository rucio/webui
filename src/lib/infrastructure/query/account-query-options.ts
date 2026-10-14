import type { AccountErrorType } from '@/lib/infrastructure/data/view-model/account';

/**
 * Shared options for account queries. The global QueryClient defaults are left alone
 * (they affect every page); account queries opt in.
 * Each queryFn throws the view model on failure, so `error.errorType` is available here.
 */
export const accountQueryDefaults = {
    // tab switches and back-navigation within 30s are instant
    staleTime: 30_000,
    // only unknown failures are worth retrying; never retry 401/403/404/409/400
    retry: (failureCount: number, error: { errorType?: AccountErrorType } | null | undefined): boolean =>
        error?.errorType === 'unknown' && failureCount < 2,
} as const;
