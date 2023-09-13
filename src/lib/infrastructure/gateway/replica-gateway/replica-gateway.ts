import { ListReplicasDTO } from "@/lib/core/dto/replica-dto";
import ReplicaGatewayOutputPort from "@/lib/core/port/secondary/replica-gateway-output-port";
import { injectable } from "inversify";
import ListFileReplicasEndpoint from "./endpoints/list-file-replicas-endpoint";

@injectable()
export default class ReplicaGateway implements ReplicaGatewayOutputPort {
    async listReplicas(rucioAuthToken: string, scope: string, name: string): Promise<ListReplicasDTO> {
        const endpoint = new ListFileReplicasEndpoint()
        const dto = await endpoint.fetch()
        if(dto === undefined) {
            throw new Error('Error fetching replicas')
        }
        return dto
    }
}