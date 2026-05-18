import { ListSuspiciousReplicasDTO } from '@/lib/core/dto/replica-dto';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { convertToSuspiciousReplicaDTO, TRucioSuspiciousReplica } from '../replica-gateway-utils';

/**
 * Endpoint for `GET /replicas/suspicious/`.
 *
 * Unlike the sibling replica endpoints (e.g. list-file-replicas, list-dataset-replicas),
 * which stream NDJSON (`application/x-json-stream`), the Rucio server returns the
 * suspicious replicas as a single JSON array with Content-Type `application/json`.
 *
 * For that reason this is modelled as a non-streaming `BaseEndpoint` rather than a
 * `BaseStreamableEndpoint`: the non-NDJSON streaming transform (`super(false)`) is
 * unused across the codebase and mishandles multi-element arrays that arrive in a
 * single chunk. `createDTO` therefore receives the full parsed array and maps it to
 * a list of suspicious replica items (`ListSuspiciousReplicasDTO.replicas`).
 */
export default class ListSuspiciousReplicasEndpoint extends BaseEndpoint<ListSuspiciousReplicasDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly rseExpression?: string,
        private readonly youngerThan?: string,
        private readonly nattempts?: number,
    ) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        this.url = `${this.rucioHost}/replicas/suspicious/`;

        const params: { [key: string]: string } = {};
        if (this.rseExpression !== undefined) {
            params.rse_expression = this.rseExpression;
        }
        if (this.youngerThan !== undefined) {
            params.younger_than = this.youngerThan;
        }
        if (this.nattempts !== undefined) {
            params.nattempts = this.nattempts.toString();
        }

        const request: HTTPRequest = {
            method: 'GET',
            url: this.url,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: null,
            params: Object.keys(params).length > 0 ? params : undefined,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<ListSuspiciousReplicasDTO | undefined> {
        const errorDetails = await extractErrorMessage(response);
        const dto: ListSuspiciousReplicasDTO = {
            status: 'error',
            replicas: [],
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(dto);
    }

    createDTO(data: object | string): ListSuspiciousReplicasDTO {
        const items: TRucioSuspiciousReplica[] = Array.isArray(data) ? (data as TRucioSuspiciousReplica[]) : [];
        const dto: ListSuspiciousReplicasDTO = {
            status: 'success',
            replicas: items.map(item => convertToSuspiciousReplicaDTO(item)),
        };
        return dto;
    }
}
