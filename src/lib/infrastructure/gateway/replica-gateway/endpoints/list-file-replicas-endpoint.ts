import { FileReplicaStateDTO, ListReplicasDTO } from '@/lib/core/dto/replica-dto';
import { BaseStreamableEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';
import { convertToFileReplicaStateDTOs, TRucioFileReplica } from '../replica-gateway-utils';

/**
 * Lists replicas for a given File DID via Streaming
 */
export default class ListFileReplicasEndpoint extends BaseStreamableEndpoint<ListReplicasDTO, FileReplicaStateDTO> {
    constructor(private rucioAuthToken: string, private scope: string, private name: string) {
        super(true);
    }
    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/replicas/list`;
        const request: HTTPRequest = {
            method: 'POST',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: {
                dids: [
                    {
                        scope: this.scope,
                        name: this.name,
                    },
                ],
                all_states: true,
                ignore_availability: true,
            },
            params: undefined,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<ListReplicasDTO | undefined> {
        if (statusCode === 200) {
            return Promise.resolve(undefined);
        }

        const errorDetails = await extractErrorMessage(response);

        const errorDTO: ListReplicasDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(response: Buffer): FileReplicaStateDTO[] {
        const data: TRucioFileReplica = JSON.parse(JSON.parse(response.toString()));
        const dtos: FileReplicaStateDTO[] = convertToFileReplicaStateDTOs(data);
        return dtos;
    }
}
