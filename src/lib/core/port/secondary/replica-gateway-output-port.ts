import { ListReplicasDTO } from "@/lib/core/dto/replica-dto";
import { DatasetReplicasDTO } from "@/lib/core/dto/replica-dto";

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
}
