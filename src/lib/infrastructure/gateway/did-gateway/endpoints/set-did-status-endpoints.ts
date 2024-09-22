import { SetDIDStatusDTO } from '@/lib/core/dto/did-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';

export default class SetDIDStatusEndpoint extends BaseEndpoint<SetDIDStatusDTO> {
    constructor(private rucioAuthToken: string, private scope: string, private name: string, private open: boolean) {
        //parse body as text
        super(true);
    }
    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize();
        this.url = `${this.rucioHost}/dids/${this.scope}/${this.name}/status`;
        const request: HTTPRequest = {
            method: 'PUT',
            url: this.url,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: {
                open: this.open,
            },
            params: undefined,
        };
        this.request = request;
        this.initialized = true;
    }

    /**
     * @implements
     * Status 409 means
     */
    async reportErrors(statusCode: number, response: Response): Promise<SetDIDStatusDTO | undefined> {
        const dto: SetDIDStatusDTO = {
            status: 'error',
            errorCode: statusCode,
            errorType: 'gateway_endpoint_error',
            scope: this.scope,
            name: this.name,
            open: this.open,
        };
        if (statusCode === 409) {
            dto.errorMessage = `The status of DID ${this.scope}:${this.name} cannot be changed. It is possible that the status is already set to ${
                this.open ? 'open' : 'closed'
            }`;
            dto.errorName = 'Cannot Change DID Status';
            return dto;
        }
        const error = await response.json();
        dto.errorMessage = error.errorMessage;
        dto.errorName = 'Rucio Server Error';
        return dto;
    }

    /**
     * @implements
     */
    createDTO(data: any): SetDIDStatusDTO {
        return {
            status: 'success',
            scope: this.scope,
            name: this.name,
            open: this.open,
        };
    }
}
