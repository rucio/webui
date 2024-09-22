import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { DIDExtendedDTO } from '@/lib/core/dto/did-dto';
import { DIDType } from '@/lib/core/entity/rucio';
import { Response } from 'node-fetch';

export default class GetDIDEndpoint extends BaseEndpoint<DIDExtendedDTO> {
    constructor(
        private rucioAuthToken: string,
        private scope: string,
        private name: string,
        private dynamicDepth: DIDType.DATASET | DIDType.FILE | undefined = undefined,
    ) {
        super();
    }
    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize();
        this.url = `${this.rucioHost}/dids/${this.scope}/${this.name}/status`;
        if (this.dynamicDepth) {
            this.url += `?dynamic_depth=${this.dynamicDepth.toUpperCase()}`;
        }
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
    async reportErrors(statusCode: number, response: Response): Promise<DIDExtendedDTO | undefined> {
        const dto: DIDExtendedDTO = {
            status: 'error',
            errorCode: statusCode,
            errorType: 'gateway_endpoint_error',
            name: this.name,
            scope: this.scope,
            did_type: DIDType.UNKNOWN,
            account: '',
            open: false,
            monotonic: false,
            expired_at: '',
            bytes: 0,
            length: 0,
        };

        switch (statusCode) {
            case 400:
                dto.errorMessage = 'Invalid Parameters';
                break;
            case 404:
                const error = await response.json();
                if (error.exception === 'DataIdentifierNotFound') {
                    dto.errorMessage = 'Data Identifier Not Found';
                }
                if (error.exception === 'ScopeNotFound') {
                    dto.errorMessage = 'Scope Not Found';
                }
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
    createDTO(data: any): DIDExtendedDTO {
        data = data as {
            type: string;
            account: string;
            open: boolean;
            monotonic: boolean;
            expired_at: string;
            bytes: number;
            length: number;
        };

        const type = data.type;
        let did_type: DIDType = DIDType.UNKNOWN;
        if (type === 'DATASET') {
            did_type = DIDType.DATASET;
        } else if (type === 'CONTAINER') {
            did_type = DIDType.CONTAINER;
        } else if (type === 'FILE') {
            did_type = DIDType.FILE;
        }

        const dto: DIDExtendedDTO = {
            status: 'success',
            name: this.name,
            scope: this.scope,
            did_type: did_type,
            account: data.account,
            open: data.open,
            monotonic: data.monotonic,
            expired_at: data.expired_at,
            bytes: data.bytes,
            length: data.length,
        };
        return dto;
    }
}
