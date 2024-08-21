import { AddDIDDTO } from '@/lib/core/dto/did-dto';
import { DIDType } from '@/lib/core/entity/rucio';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';

export default class AddDIDEndpoint extends BaseEndpoint<AddDIDDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly scope: string,
        private readonly name: string,
        private readonly didType: DIDType,
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/dids/${this.scope}/${this.name}`;
        const request: HTTPRequest = {
            method: 'POST',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: {
                scope: this.scope,
                name: this.name,
                type: this.didType.toUpperCase(),
            },
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<AddDIDDTO | undefined> {
        const errorDTO: AddDIDDTO = {
            status: 'error',
            created: false,
            errorMessage: 'Unknown Exception while making the request to Rucio Server or parsing the response from Rucio Server',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway-endpoint-error',
        };
        if (statusCode === 409) {
            errorDTO.errorMessage = `DID ${this.scope}:${this.name} Already Exists`;
            errorDTO.errorName = 'DID Already Attached';
            return errorDTO;
        }
        const error = await extractErrorMessage(response);
        errorDTO.errorMessage = error;
        errorDTO.errorName = 'Rucio Server Error';
        return errorDTO;
    }

    createDTO(data: string): AddDIDDTO {
        const dto: AddDIDDTO = {
            status: 'success',
            created: data.toLowerCase() === 'created' ? true : false,
        };
        return dto;
    }
}
