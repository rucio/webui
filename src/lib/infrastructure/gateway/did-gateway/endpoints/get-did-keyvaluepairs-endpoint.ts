import { DIDKeyValuePairsDTO } from '@/lib/core/dto/did-dto';
import { DIDKeyValuePair } from '@/lib/core/entity/rucio';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';

export default class GetDIDKeyValuePairsEndpoint extends BaseEndpoint<DIDKeyValuePairsDTO> {
    constructor(private rucioAuthToken: string, private scope: string, private name: string) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const encodedScope = encodeURIComponent(this.scope);
        const encodedName = encodeURIComponent(this.name);
        this.url = `${this.rucioHost}/dids/${encodedScope}/${encodedName}/meta`;
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

    reportErrors(statusCode: number, response: Response): Promise<DIDKeyValuePairsDTO | undefined> {
        if (statusCode === 200) {
            return Promise.resolve(undefined);
        }
        return Promise.resolve({ status: 'error', data: [] } as DIDKeyValuePairsDTO); // TODO: add error message
    }

    createDTO(response: object): DIDKeyValuePairsDTO {
        const dto: DIDKeyValuePairsDTO = {
            status: 'success',
            data: Object.entries(response).map(([key, value]) => {
                return { key: key, value: value } as DIDKeyValuePair;
            }),
        };
        return dto;
    }
}
