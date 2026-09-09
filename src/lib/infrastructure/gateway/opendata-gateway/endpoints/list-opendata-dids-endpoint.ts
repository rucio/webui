import { ListOpenDataDIDsDTO, OpenDataDIDListItemDTO } from '@/lib/core/dto/opendata-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

export default class ListOpenDataDIDsEndpoint extends BaseEndpoint<ListOpenDataDIDsDTO> {
    constructor(private rucioAuthToken: string, private limit?: number, private offset?: number, private state?: string) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();

        const params = new URLSearchParams();

        if (this.limit !== undefined) {
            params.set('limit', String(this.limit));
        }

        if (this.offset !== undefined) {
            params.set('offset', String(this.offset));
        }

        if (this.state) {
            params.set('state', this.state);
        }

        const query = params.toString();

        this.url = `${this.rucioHost}/opendata/dids${query ? `?${query}` : ''}`;

        const request: HTTPRequest = {
            method: 'GET',
            url: this.url,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: null,
            params: undefined,
        };

        this.request = request;
        this.initialized = true;
    }

    reportErrors(statusCode: number, response: Response): Promise<ListOpenDataDIDsDTO | undefined> {
        return Promise.resolve(undefined);
    }

    createDTO(data: any): ListOpenDataDIDsDTO {
        const response = data as {
            total?: number;
            offset?: number;
            dids?: Array<{
                scope: string;
                name: string;
                state?: string;
                created_at?: string;
                updated_at?: string;
            }>;
        };

        const dids: OpenDataDIDListItemDTO[] =
            response.dids?.map(did => ({
                scope: did.scope,
                name: did.name,
                state: did.state,
                created_at: did.created_at,
                updated_at: did.updated_at,
            })) ?? [];

        return {
            status: 'success',
            total: response.total ?? dids.length,
            offset: response.offset ?? 0,
            dids,
        };
    }
}
