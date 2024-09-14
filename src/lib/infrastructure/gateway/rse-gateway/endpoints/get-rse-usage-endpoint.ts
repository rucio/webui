import {BaseEndpoint} from "@/lib/sdk/gateway-endpoints";
import {HTTPRequest} from "@/lib/sdk/http";
import {Response} from "node-fetch";
import {RSEUsageDTO} from "@/lib/core/dto/rse-dto";

export default class GetRSEUsageEndpoint extends BaseEndpoint<RSEUsageDTO> {
    constructor(
        private rucioAuthToken: string,
        private rseName: string,
    ) {
        super()
    }

    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize()
        this.url = `${this.rucioHost}/rses/${this.rseName}/usage`
        const request: HTTPRequest = {
            method: 'GET',
            url: this.url,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: null,
            params: undefined
        }
        this.request = request
        this.initialized = true
    }

    /**
     * @implements
     */
    async reportErrors(statusCode: number, response: Response): Promise<RSEUsageDTO | undefined> {
        const dto: RSEUsageDTO = {
            status: 'error',
            errorCode: statusCode,
            errorType: 'gateway_endpoint_error',
            rse: this.rseName,
            rse_id: '',
            source: '',
            used: 0,
            files: 0,
            total: 0,
            updated_at: ''
        }

        switch (statusCode) {
            case 404:
                const error = await response.json()
                dto.errorMessage = error
                break;
            default:
                dto.errorMessage = 'Unknown Error'
                break;
        }
        return dto
    }

    /**
     * @implements
     */
    createDTO(data: any): RSEUsageDTO {
        data = data as {
            rse_id: string;
            rse: string;
            source: string;
            used: number;
            total: number;
            files: number;
            updated_at: string;
        }

        return {
            status: 'success',
            ...data
        }
    }
}