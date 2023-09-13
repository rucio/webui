import { DatasetReplicasDTO, ListReplicasDTO } from "@/lib/core/dto/replica-dto";
import { BaseStreamableEndpoint, extractErrorMessage } from "@/lib/sdk/gateway-endpoints";
import { HTTPRequest } from "@/lib/sdk/http";
import { Response } from "node-fetch";
import { convertToDatasetReplicaDTO, TRucioDatasetReplica } from "../replica-gateway-utils";

export default class ListDatasetReplicasEndpoint extends BaseStreamableEndpoint<ListReplicasDTO, DatasetReplicasDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly scope: string,
        private readonly name: string,
    ) {
        super(true)
    }
    async initialize(): Promise<void> {
        await super.initialize()
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/replicas/${this.scope}/${this.name}/datasets`
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: undefined
        }
        this.request = request
        this.initialized = true
    }

    async reportErrors(statusCode: number, response: Response): Promise<ListReplicasDTO | undefined> {
        if (statusCode === 200) {
            return Promise.resolve(undefined)
        }

        let errorDetails = await extractErrorMessage(response)

        const errorDTO: ListReplicasDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails?? 'No error details available from rucio'}`,
        }
        return Promise.resolve(errorDTO)
    }

    createDTO(response: Buffer): DatasetReplicasDTO {
        const data: TRucioDatasetReplica = JSON.parse(JSON.parse(response.toString()))
        const dto: DatasetReplicasDTO = convertToDatasetReplicaDTO(data)
        return dto
    }

}