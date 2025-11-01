import { RSEDetailsDTO } from '@/lib/core/dto/rse-dto';
import { RSEDetails, RSEType } from '@/lib/core/entity/rucio';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

export default class GetRSEEndpoint extends BaseEndpoint<RSEDetailsDTO> {
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
    async reportErrors(statusCode: number, response: Response): Promise<RSEDetailsDTO | undefined> {
        const dto: RSEDetailsDTO = {
            status: 'error',
            errorCode: statusCode,
            errorType: 'gateway_endpoint_error',
            protocols: [],
            availability_write: false,
            availability_delete: false,
            availability_read: false,
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
    createDTO(data: any): RSEDetailsDTO {
        data = data as RSEDetails;

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
        const dto: RSEDetailsDTO = {
            status: 'success',
            id: data.id,
            name: data.rse,
            rse_type: data.rse_type,
            volatile: data.volatile,
            deterministic: data.deterministic,
            staging_area: data.staging_area,
            protocols: data.protocols,
            availability_write: data.availability_write,
            availability_read: data.availability_read,
            availability_delete: data.availability_delete,
        };
        return dto;
    }
}
