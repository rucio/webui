import { ListReplicasDTO } from "@/lib/core/dto/replica-dto";
import ReplicaGatewayOutputPort from "@/lib/core/port/secondary/replica-gateway-output-port";
import { injectable } from "inversify";
import ListDatasetReplicasEndpoint from "./endpoints/list-dataset-replicas-endpoint";
import ListFileReplicasEndpoint from "./endpoints/list-file-replicas-endpoint";

@injectable()
export default class ReplicaGateway implements ReplicaGatewayOutputPort {
       
    async listFileReplicas(rucioAuthToken: string, scope: string, name: string): Promise<ListReplicasDTO> {
        try {
        const endpoint = new ListFileReplicasEndpoint(rucioAuthToken, scope, name)
        const errorDTO: ListReplicasDTO | undefined = await endpoint.fetch()
        if(!errorDTO) {
            return {
                status: 'success',
                stream: endpoint
            }
        }
        return errorDTO
        } catch(error) {
            const errorDTO: ListReplicasDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching file replicas',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            }
            return Promise.resolve(errorDTO)
        }
    }

    async listDatasetReplicas(rucioAuthToken: string, scope: string, name: string): Promise<ListReplicasDTO> {
        try {
        const endpoint = new ListDatasetReplicasEndpoint(rucioAuthToken, scope, name)
        const errorDTO: ListReplicasDTO | undefined = await endpoint.fetch()
        if(!errorDTO) {
            return {
                status: 'success',
                stream: endpoint
            }
        }
        return errorDTO
        } catch(error) {
            const errorDTO: ListReplicasDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching dataset replicas',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            }
            return Promise.resolve(errorDTO)
        }
    }
}