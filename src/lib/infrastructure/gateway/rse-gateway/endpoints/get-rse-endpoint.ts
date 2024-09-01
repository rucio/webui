import { RSEDTO } from '@/lib/core/dto/rse-dto';
import { RSEType } from '@/lib/core/entity/rucio';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';

export default class GetRSEEndpoint extends BaseEndpoint<RSEDTO> {
    constructor(private rucioAuthToken: string, private rseName: string) {
        super();
    }

    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize();
        this.url = `${this.rucioHost}/rses/${this.rseName}`;
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

    /**
     * @implements
     */
    async reportErrors(statusCode: number, response: Response): Promise<RSEDTO | undefined> {
        const dto: RSEDTO = {
            status: 'error',
            errorCode: statusCode,
            errorType: 'gateway_endpoint_error',
            id: '',
            name: this.rseName,
            rse_type: RSEType.UNKNOWN,
            volatile: false,
            deterministic: false,
            staging_area: false,
        };

        switch (statusCode) {
            case 404:
                const error = await response.json();
                dto.errorMessage = error;
                break;
            default:
                dto.errorMessage = 'Unknown Error';
                break;
        }
        return dto;
    }

    /**
     * @implements
     */
    createDTO(data: any): RSEDTO {
        data = data as {
            id: string;
            rse: string;
            rse_type: string;
            volatile: boolean;
            deterministic: boolean;
            staging_area: boolean;
        };

        switch (data.rse_type.toUpperCase()) {
            case 'DISK':
                data.rse_type = RSEType.DISK;
                break;
            case 'TAPE':
                data.rse_type = RSEType.TAPE;
                break;
            default:
                data.rse_type = RSEType.UNKNOWN;
                break;
        }
        const dto: RSEDTO = {
            status: 'success',
            id: data.id,
            name: data.rse,
            rse_type: data.rse_type,
            volatile: data.volatile,
            deterministic: data.deterministic,
            staging_area: data.staging_area,
        };
        return dto;
    }
}
