import { DeclareBadPFNsDTO } from '@/lib/core/dto/replica-dto';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Endpoint for `POST /replicas/bad/pfns/`.
 * The Rucio server responds with a `201 Created` and a plain-text body (`Created`),
 * so the endpoint parses the response body as text.
 */
export default class DeclareBadPFNsEndpoint extends BaseEndpoint<DeclareBadPFNsDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly pfns: string[],
        private readonly reason: string,
        private readonly state: string,
        private readonly expiresAt?: string | null,
    ) {
        // parse body as text
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/replicas/bad/pfns/`;

        const body: { [key: string]: any } = {
            pfns: this.pfns,
            reason: this.reason,
            state: this.state,
        };
        if (this.expiresAt !== undefined) {
            body.expires_at = this.expiresAt;
        }

        const request: HTTPRequest = {
            method: 'POST',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: body,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<DeclareBadPFNsDTO | undefined> {
        const error = await extractErrorMessage(response);
        const errorDTO: DeclareBadPFNsDTO = {
            status: 'error',
            created: false,
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${error ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(data: object | string): DeclareBadPFNsDTO {
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
        const dto: DeclareBadPFNsDTO = {
            status: 'success',
            created: dataStr.toLowerCase().includes('created'),
        };
        return dto;
    }
}
