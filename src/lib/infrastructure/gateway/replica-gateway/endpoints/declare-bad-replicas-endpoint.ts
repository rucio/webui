import { DeclareBadReplicasDTO, NotDeclaredReplicaDTO } from '@/lib/core/dto/replica-dto';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Endpoint for `POST /replicas/bad/dids/`.
 *
 * Body shape: `{ dids: [{scope, name}], rse, reason, expires_at? }`.
 * On success the server returns 201 with a JSON array body of replicas it
 * refused to mark bad (typically empty == every supplied DID accepted).
 */
export default class DeclareBadReplicasEndpoint extends BaseEndpoint<DeclareBadReplicasDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly dids: Array<{ scope: string; name: string }>,
        private readonly rse: string,
        private readonly reason: string,
        private readonly expiresAt?: string | null,
    ) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        this.url = `${this.rucioHost}/replicas/bad/dids/`;

        const body: Record<string, unknown> = {
            dids: this.dids,
            rse: this.rse,
            reason: this.reason,
        };
        if (this.expiresAt !== undefined) {
            body.expires_at = this.expiresAt;
        }

        const request: HTTPRequest = {
            method: 'POST',
            url: this.url,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: body,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<DeclareBadReplicasDTO | undefined> {
        const error = await extractErrorMessage(response);
        const dto: DeclareBadReplicasDTO = {
            status: 'error',
            notDeclared: [],
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${error ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(dto);
    }

    createDTO(data: object | string): DeclareBadReplicasDTO {
        // Rucio returns either a JSON array of "could not be declared" entries or
        // an empty array. Defensive: tolerate object/string shapes from upstream.
        let items: unknown[] = [];
        if (Array.isArray(data)) {
            items = data;
        } else if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) items = parsed;
            } catch {
                items = [];
            }
        }

        const notDeclared: NotDeclaredReplicaDTO[] = items
            .filter((it): it is Record<string, unknown> => typeof it === 'object' && it !== null)
            .map(it => ({
                scope: String(it.scope ?? ''),
                name: String(it.name ?? ''),
                rse: String(it.rse ?? ''),
                reason: it.reason !== undefined ? String(it.reason) : undefined,
            }));

        return { status: 'success', notDeclared };
    }
}
