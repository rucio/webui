import { ListReplicasDTO } from '@/lib/core/dto/replica-dto';
import { DatasetReplicasDTO } from '@/lib/core/dto/replica-dto';
import { DeclareBadPFNsDTO, ListSuspiciousReplicasDTO } from '@/lib/core/dto/replica-dto';

/**
 * Output port for the Replica Gateway, responsible for defining the methods that the Gateway will use to interact with the Rucio Server.
 */
export default interface ReplicaGatewayOutputPort {
    /**
     * Lists file replicas for a given  DID.
     * @param rucioAuthToken - The Rucio auth token to use for authentication.
     * @param scope - The scope of the DID.
     * @param name - The name of the DID.
     * @returns A Promise that resolves to a ListReplicasDTO object.
     */
    listFileReplicas(rucioAuthToken: string, scope: string, name: string): Promise<ListReplicasDTO>;

    /**
     * Lists dataset replicas for a given  DID. Each stream element is of type {@link DatasetReplicasDTO}
     * @param rucioAuthToken - The Rucio auth token to use for authentication.
     * @param scope - The scope of the DID.
     * @param name - The name of the DID.
     * @returns A Promise that resolves to a ListReplicasDTO object.
     */
    listDatasetReplicas(rucioAuthToken: string, scope: string, name: string): Promise<ListReplicasDTO>;

    /**
     * Lists suspicious replicas. Each stream element is of type {@link SuspiciousReplicaDTO}.
     * @param rucioAuthToken - The Rucio auth token to use for authentication.
     * @param rseExpression - Optional RSE expression to filter the suspicious replicas.
     * @param youngerThan - Optional date string; only replicas created after this date are returned.
     * @param nattempts - Optional minimum number of access attempts to filter by.
     * @returns A Promise that resolves to a ListSuspiciousReplicasDTO object.
     */
    listSuspiciousReplicas(
        rucioAuthToken: string,
        rseExpression?: string,
        youngerThan?: string,
        nattempts?: number,
    ): Promise<ListSuspiciousReplicasDTO>;

    /**
     * Declares bad PFNs (physical file names) on the Rucio Server.
     * @param rucioAuthToken - The Rucio auth token to use for authentication.
     * @param pfns - The list of PFNs to declare.
     * @param reason - The reason for declaring the PFNs as bad.
     * @param state - The state to set for the declared PFNs (e.g. BAD, SUSPICIOUS, TEMPORARY_UNAVAILABLE).
     * @param expiresAt - Optional expiry date string for the declaration.
     * @returns A Promise that resolves to a DeclareBadPFNsDTO object.
     */
    declareBadPFNs(rucioAuthToken: string, pfns: string[], reason: string, state: string, expiresAt?: string | null): Promise<DeclareBadPFNsDTO>;
}
