import { DeclareBadPFNsDTO, ListReplicasDTO, ListSuspiciousReplicasDTO } from '@/lib/core/dto/replica-dto';
import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import { injectable } from 'inversify';
import ListDatasetReplicasEndpoint from './endpoints/list-dataset-replicas-endpoint';
import ListFileReplicasEndpoint from './endpoints/list-file-replicas-endpoint';
import ListSuspiciousReplicasEndpoint from './endpoints/list-suspicious-replicas-endpoint';
import DeclareBadPFNsEndpoint from './endpoints/declare-bad-pfns-endpoint';

@injectable()
export default class ReplicaGateway implements ReplicaGatewayOutputPort {
    async listFileReplicas(rucioAuthToken: string, scope: string, name: string): Promise<ListReplicasDTO> {
        try {
            const endpoint = new ListFileReplicasEndpoint(rucioAuthToken, scope, name);
            const errorDTO: ListReplicasDTO | undefined = await endpoint.fetch();
            if (!errorDTO) {
                return {
                    status: 'success',
                    stream: endpoint,
                };
            }
            return errorDTO;
        } catch (error) {
            const errorDTO: ListReplicasDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching file replicas',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            };
            return Promise.resolve(errorDTO);
        }
    }

    async listDatasetReplicas(rucioAuthToken: string, scope: string, name: string): Promise<ListReplicasDTO> {
        try {
            const endpoint = new ListDatasetReplicasEndpoint(rucioAuthToken, scope, name);
            const errorDTO: ListReplicasDTO | undefined = await endpoint.fetch();
            if (!errorDTO) {
                return {
                    status: 'success',
                    stream: endpoint,
                };
            }
            return errorDTO;
        } catch (error) {
            const errorDTO: ListReplicasDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching dataset replicas',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            };
            return Promise.resolve(errorDTO);
        }
    }

    async listSuspiciousReplicas(
        rucioAuthToken: string,
        rseExpression?: string,
        youngerThan?: string,
        nattempts?: number,
    ): Promise<ListSuspiciousReplicasDTO> {
        try {
            const endpoint = new ListSuspiciousReplicasEndpoint(rucioAuthToken, rseExpression, youngerThan, nattempts);
            const dto: ListSuspiciousReplicasDTO = await endpoint.fetch();
            return dto;
        } catch (error) {
            const errorDTO: ListSuspiciousReplicasDTO = {
                status: 'error',
                replicas: [],
                errorName: 'Exception occurred while fetching suspicious replicas',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            };
            return Promise.resolve(errorDTO);
        }
    }

    async declareBadPFNs(
        rucioAuthToken: string,
        pfns: string[],
        reason: string,
        state: string,
        expiresAt?: string | null,
    ): Promise<DeclareBadPFNsDTO> {
        try {
            const endpoint = new DeclareBadPFNsEndpoint(rucioAuthToken, pfns, reason, state, expiresAt);
            const dto: DeclareBadPFNsDTO = await endpoint.fetch();
            return dto;
        } catch (error) {
            const errorDTO: DeclareBadPFNsDTO = {
                status: 'error',
                created: false,
                errorName: 'Exception occurred while declaring bad PFNs',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            };
            return Promise.resolve(errorDTO);
        }
    }
}
