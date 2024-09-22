import { AttachDIDDTO } from '@/lib/core/dto/did-dto';
import { DID } from '@/lib/core/entity/rucio';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';

export default class AttachDIDsEndpoint extends BaseEndpoint<AttachDIDDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly scope: string,
        private readonly name: string,
        private readonly dids: DID[],
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/dids/${this.scope}/${this.name}/dids`;
        const request: HTTPRequest = {
            method: 'POST',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: {
                dids: this.dids.map(did => {
                    return {
                        scope: did.scope,
                        name: did.name,
                    };
                }),
            },
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<AttachDIDDTO | undefined> {
        const errorDTO: AttachDIDDTO = {
            status: 'error',
            created: false,
            errorMessage: 'Unknown Exception from Rucio Server',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway-endpoint-error',
        };
        if (statusCode === 409) {
            errorDTO.errorMessage = `Already Attached`;
            errorDTO.errorName = 'DID Already Attached';
            return errorDTO;
        }
        const error = await extractErrorMessage(response);
        errorDTO.errorMessage = error;
        return errorDTO;
    }

    createDTO(data: string): AttachDIDDTO {
        const dto: AttachDIDDTO = {
            status: 'success',
            created: data.toLowerCase() === 'created' ? true : false,
        };
        return dto;
    }
}
