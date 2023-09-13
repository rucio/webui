import { FileReplicaStateDTO } from "@/lib/core/dto/replica-dto";
import { ReplicaState } from "@/lib/core/entity/rucio";

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

function getReplicaState(state: string): ReplicaState {
    switch(state.toUpperCase()) {
        case 'AVAILABLE':
            return ReplicaState.AVAILABLE
        case 'UNAVAILABLE':
            return ReplicaState.UNAVAILABLE
        case 'COPYING':
            return ReplicaState.COPYING
        case 'BEING_DELETED':
            return ReplicaState.BEING_DELETED
        case 'BAD':
            return ReplicaState.BAD
        case 'TEMPORARY_UNAVAILABLE':
            return ReplicaState.TEMPORARY_UNAVAILABLE
        default:
            return ReplicaState.UNKNOWN
    }
}

/**
 * Get a list of FileReplicaStateDTO objects from a Rucio Server response.
 * @param replica The response from Rucio Server containing the file replica states.
 * @returns A list of FileReplicaStateDTO objects.
 */
export function convertToFileReplicaStateDTOs(
  replica: TRucioFileReplica
): FileReplicaStateDTO[] {
    const dtoList: FileReplicaStateDTO[] = [];
    for ( const rse in replica.rses) {
        const state: ReplicaState = getReplicaState(replica.states[rse]);
        const replicaStateDTO: FileReplicaStateDTO = {
            status: state === ReplicaState.UNKNOWN ? 'error' : 'success',
            rse: rse,
            state: state,
        }
        dtoList.push(replicaStateDTO);
    }
    return dtoList;
}