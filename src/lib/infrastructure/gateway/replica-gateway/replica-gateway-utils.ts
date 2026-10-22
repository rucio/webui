import { DatasetReplicasDTO, FileReplicaStateDTO, SuspiciousReplicaDTO } from '@/lib/core/dto/replica-dto';
import { ReplicaState } from '@/lib/core/entity/rucio';

export type TRucioFileReplica = {
    scope: string;
    name: string;
    bytes: number;
    md5: string;
    adler32: string;
    pfns: {
        [key: string]: {
            rse_id: string;
            rse: string;
            type: string;
            volatile: boolean;
            domain: string;
            priority: number;
            client_extract: boolean;
        };
    };
    // RSE name -> PFNs. Only RSEs where Rucio could build at least one PFN appear here.
    rses: {
        [key: string]: string[];
    };
    // RSE name -> replica state, for every replica of the file
    states: {
        [key: string]: string;
    };
};

/**
 * The type representing a Rucio Dataset Replica returned by Rucio REST API
 */
export type TRucioDatasetReplica = {
    scope: string;
    name: string;
    rse: string;
    rse_id: string;
    bytes: number;
    length: number;
    available_bytes: number;
    available_length: number;
    state: string;
    created_at: string;
    updated_at: string;
    accessed_at: string | null;
};

/**
 * The type representing a Rucio Suspicious Replica returned by the Rucio REST API.
 */
export type TRucioSuspiciousReplica = {
    scope: string;
    name: string;
    rse: string;
    rse_id: string;
    cnt: number;
    created_at: string;
};

/**
 * Convert a raw Rucio suspicious replica response into a SuspiciousReplicaDTO.
 * @param data A single suspicious replica entry from the Rucio Server response.
 * @returns A SuspiciousReplicaDTO object.
 */
export function convertToSuspiciousReplicaDTO(data: TRucioSuspiciousReplica): SuspiciousReplicaDTO {
    const dto: SuspiciousReplicaDTO = {
        status: 'success',
        scope: data.scope,
        name: data.name,
        rse: data.rse,
        rseId: data.rse_id,
        cnt: data.cnt,
        createdAt: data.created_at,
    };
    return dto;
}

function getReplicaState(state: string): ReplicaState {
    switch (state.toUpperCase()) {
        case 'AVAILABLE':
            return ReplicaState.AVAILABLE;
        case 'UNAVAILABLE':
            return ReplicaState.UNAVAILABLE;
        case 'COPYING':
            return ReplicaState.COPYING;
        case 'BEING_DELETED':
            return ReplicaState.BEING_DELETED;
        case 'BAD':
            return ReplicaState.BAD;
        case 'TEMPORARY_UNAVAILABLE':
            return ReplicaState.TEMPORARY_UNAVAILABLE;
        default:
            return ReplicaState.UNKNOWN;
    }
}

const PFN_DOMAINS = ['lan', 'wan', 'zip'] as const;

function getPFNDomain(domain: string): FileReplicaStateDTO['domain'] {
    return (PFN_DOMAINS as readonly string[]).includes(domain) ? (domain as FileReplicaStateDTO['domain']) : null;
}

/**
 * Get a list of FileReplicaStateDTO objects from a Rucio Server response, one per PFN like `rucio replica list file`.
 * Replicas without a PFN (no readable protocol, or filtered out by schemes) still get one row with null PFN fields,
 * because Rucio lists them in `states` but not in `pfns`.
 * @param replica The response from Rucio Server containing the file replicas.
 * @returns A list of FileReplicaStateDTO objects, in server priority order followed by replicas without a PFN.
 */
export function convertToFileReplicaStateDTOs(replica: TRucioFileReplica): FileReplicaStateDTO[] {
    const states = replica.states ?? {};
    const fileFields = {
        scope: replica.scope,
        name: replica.name,
        bytes: replica.bytes,
        adler32: replica.adler32,
    };
    const toDTO = (rse: string, pfnFields: Pick<FileReplicaStateDTO, 'pfn' | 'protocol' | 'domain' | 'priority' | 'rseType'>) => {
        const state: ReplicaState = getReplicaState(states[rse] ?? '');
        const dto: FileReplicaStateDTO = {
            status: state === ReplicaState.UNKNOWN ? 'error' : 'success',
            ...fileFields,
            rse: rse,
            state: state,
            ...pfnFields,
        };
        return dto;
    };

    const dtoList: FileReplicaStateDTO[] = [];
    const rsesWithPFN = new Set<string>();
    for (const [pfn, info] of Object.entries(replica.pfns ?? {})) {
        rsesWithPFN.add(info.rse);
        dtoList.push(
            toDTO(info.rse, {
                pfn: pfn,
                protocol: pfn.includes('://') ? pfn.split('://')[0] : null,
                domain: getPFNDomain(info.domain),
                priority: info.priority,
                rseType: info.type,
            }),
        );
    }
    for (const rse of Object.keys(states)) {
        if (rsesWithPFN.has(rse)) continue;
        dtoList.push(toDTO(rse, { pfn: null, protocol: null, domain: null, priority: null, rseType: null }));
    }
    return dtoList;
}

/**
 * Get a DatasetReplicasDTO object from a Rucio Server response.
 * @param replica A Rucio Server response containing the dataset replicas of a given dataset DID.
 * @returns DatasetReplicasDTO object.
 */
export function convertToDatasetReplicaDTO(replica: TRucioDatasetReplica): DatasetReplicasDTO {
    const dto: DatasetReplicasDTO = {
        status: 'success',
        rse: replica.rse,
        rse_id: replica.rse_id,
        bytes: replica.bytes,
        length: replica.length,
        state: getReplicaState(replica.state),
        available_length: replica.available_length,
        available_bytes: replica.available_bytes,
        created_at: replica.created_at,
        updated_at: replica.updated_at ?? '',
        accessed_at: replica.accessed_at ?? '',
    };
    return dto;
}
