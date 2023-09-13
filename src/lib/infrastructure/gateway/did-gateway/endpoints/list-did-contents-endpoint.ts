import { DIDDTO, ListDIDDTO } from "@/lib/core/dto/did-dto";
import { DIDType } from "@/lib/core/entity/rucio";
import { BaseStreamableEndpoint, extractErrorMessage } from "@/lib/sdk/gateway-endpoints";
import { HTTPRequest } from "@/lib/sdk/http";
import { Response } from "node-fetch";
import { TRucioFileReplica } from "../../replica-gateway/replica-gateway-utils";

export default class ListDIDContentsEndpoint extends BaseStreamableEndpoint<ListDIDDTO, DIDDTO> {
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
        const endpoint = `${rucioHost}/replicas/list`
        const request: HTTPRequest = {
            method: 'POST',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: {
                'dids': [{
                    'scope': this.scope,
                    'name': this.name,
                }],
                'all_states': true,
                'ignore_availability': true,
            },
            params: undefined,
        }
        this.request = request
        this.initialized = true
    }

    async reportErrors(statusCode: number, response: Response): Promise<ListDIDDTO | undefined> {
        if (statusCode === 200) {
            return Promise.resolve(undefined)
        }

        let errorDetails = await extractErrorMessage(response)

        const errorDTO: ListDIDDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails?? 'No error details available from rucio'}`,
        }
        return Promise.resolve(errorDTO)
    }

    createDTO(response: Buffer): DIDDTO {
        const data: TRucioFileReplica = JSON.parse(JSON.parse(response.toString()))
        const dto: DIDDTO = {
            status: 'success',
            scope: data.scope,
            name: data.name,
            did_type: DIDType.FILE,
        }
        return dto
    }
}