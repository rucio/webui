import { RSEProtocolDTO } from '@/lib/core/dto/rse-dto';
import { RSEProtocol } from '@/lib/core/entity/rucio';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';
import { convertToRSEDTO, covertToRSEProtocol, TRucioRSEProtocol } from '../rse-gateway-utils';

export default class GetRSEProtocolsEndpoint extends BaseEndpoint<RSEProtocolDTO> {
    constructor(private rucioAuthToken: string, private rseName: string) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        this.url = `${this.rucioHost}/rses/${this.rseName}/protocols`;
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

    async reportErrors(statusCode: number, response: Response): Promise<RSEProtocolDTO | undefined> {
        const errorMessage = await response.json();
        const error: RSEProtocolDTO = {
            status: 'error',
            errorCode: statusCode,
            errorMessage: errorMessage,
            errorName: 'Rucio Server Error',
            errorType: 'gateway_endpoint_error',
            protocols: [],
        };
        return error;
    }

    createDTO(data: Object): RSEProtocolDTO {
        const protocols: TRucioRSEProtocol[] = data as TRucioRSEProtocol[];
        const rseProtocols: RSEProtocol[] = [];
        const rseName = this.rseName;
        protocols.map((protocol: TRucioRSEProtocol) => {
            const rseProtocol = covertToRSEProtocol(protocol, rseName);
            rseProtocols.push(rseProtocol);
        });

        const rseDTO: RSEProtocolDTO = {
            status: 'success',
            protocols: rseProtocols,
        };
        return rseDTO;
    }
}
