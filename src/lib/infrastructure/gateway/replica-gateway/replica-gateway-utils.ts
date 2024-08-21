import { DatasetReplicasDTO, FileReplicaStateDTO } from '@/lib/core/dto/replica-dto';
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
    rses: {};
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

/**
 * Get a list of FileReplicaStateDTO objects from a Rucio Server response.
 * @param replica The response from Rucio Server containing the file replica states.
 * @returns A list of FileReplicaStateDTO objects.
 */
export function convertToFileReplicaStateDTOs(replica: TRucioFileReplica): FileReplicaStateDTO[] {
    const dtoList: FileReplicaStateDTO[] = [];
    for (const rse in replica.rses) {
        const state: ReplicaState = getReplicaState(replica.states[rse]);
        const replicaStateDTO: FileReplicaStateDTO = {
            status: state === ReplicaState.UNKNOWN ? 'error' : 'success',
            rse: rse,
            state: state,
        };
        dtoList.push(replicaStateDTO);
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
        availability: replica.state === 'AVAILABLE',
        available_files: replica.available_length,
        available_bytes: replica.available_bytes, // TODO: question: What is difference between available_bytes and bytes?
        creation_date: replica.created_at,
        last_accessed: replica.accessed_at ? replica.accessed_at : '',
    };
    return dto;
}
