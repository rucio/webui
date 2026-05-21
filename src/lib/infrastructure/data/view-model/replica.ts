import { BaseViewModel } from '@/lib/sdk/view-models';

/**
 * ViewModel for a single suspicious replica entry.
 * Includes a typed error discriminator per project conventions.
 */
export interface SuspiciousReplicaViewModel extends BaseViewModel {
    scope: string;
    name: string;
    rse: string;
    rseId: string;
    cnt: number;
    createdAt: string;
    /** Typed error discriminator — set when status === 'error' */
    errorType?: 'gateway_error' | 'unknown';
}

export function generateEmptySuspiciousReplicaViewModel(): SuspiciousReplicaViewModel {
    return {
        status: 'error',
        scope: '',
        name: '',
        rse: '',
        rseId: '',
        cnt: 0,
        createdAt: '',
    };
}

/**
 * ViewModel returned from the declare-bad-replicas mutation.
 * The Rucio endpoint POST /replicas/bad/dids returns a list of replicas that
 * could not be marked bad; an empty list (the success case) means every
 * supplied DID was accepted.
 */
export interface DeclareBadReplicasViewModel extends BaseViewModel {
    /** Replicas the server refused to mark bad (empty array on full success). */
    notDeclared: Array<{ scope: string; name: string; rse: string; reason?: string }>;
    /** Typed error discriminator — set when status === 'error' */
    errorType?: 'gateway_error' | 'validation_error' | 'unknown';
}

export const getEmptyDeclareBadReplicasViewModel = (): DeclareBadReplicasViewModel => ({
    status: 'error',
    notDeclared: [],
});
