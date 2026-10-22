import { FileReplicasMetalinkDTO, ListFileReplicasOptions } from '@/lib/core/dto/replica-dto';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Endpoint for `POST /replicas/list` with `Accept: application/metalink4+xml`.
 * Rucio answers with an XML document, so the body is parsed as text.
 * Without schemes, Rucio builds PFNs for every protocol it supports in metalink mode.
 */
export default class GetFileReplicasMetalinkEndpoint extends BaseEndpoint<FileReplicasMetalinkDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly scope: string,
        private readonly name: string,
        private readonly options: ListFileReplicasOptions = {},
    ) {
        // parse body as text
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const { schemes, domain, rseExpression, allStates, clientIp } = this.options;
        const request: HTTPRequest = {
            method: 'POST',
            url: `${rucioHost}/replicas/list`,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
                Accept: 'application/metalink4+xml',
                // Rucio reads the client location from this header, not from the body
                ...(clientIp ? { 'X-Forwarded-For': clientIp } : {}),
            },
            body: {
                dids: [{ scope: this.scope, name: this.name }],
                all_states: allStates ?? true,
                ignore_availability: true,
                ...(schemes && schemes.length > 0 ? { schemes } : {}),
                ...(domain ? { domain } : {}),
                ...(rseExpression ? { rse_expression: rseExpression } : {}),
            },
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<FileReplicasMetalinkDTO | undefined> {
        const error = await extractErrorMessage(response);
        const errorDTO: FileReplicasMetalinkDTO = {
            status: 'error',
            xml: '',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${error ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(data: object | string): FileReplicasMetalinkDTO {
        return {
            status: 'success',
            xml: typeof data === 'string' ? data : JSON.stringify(data),
        };
    }
}
