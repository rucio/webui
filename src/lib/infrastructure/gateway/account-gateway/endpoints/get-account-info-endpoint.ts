import { AccountInfoDTO } from "@/lib/core/dto/account-dto";
import { BaseEndpoint } from "@/lib/sdk/gateway-endpoints";
import { HTTPRequest } from "@/lib/sdk/http";
import { convertToAccountInfoDTO, getEmptyAccountInfoDTO, TRucioAccountInfo } from "../account-gateway-utils";

export default class GetAccountInfoEndpoint extends BaseEndpoint<AccountInfoDTO> {
    constructor(
        private rucioAuthToken: string,
        private account: string,
    ) {
        super()
    }

    async initialize(): Promise<void> {
        await super.initialize()
        this.url = `${this.rucioHost}/accounts/${this.account}`
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

    async reportErrors(statusCode: number): Promise<AccountInfoDTO | undefined> {
        const dto: AccountInfoDTO = {
            ...getEmptyAccountInfoDTO(),
            status: 'error',
            errorCode: statusCode,
            errorType: 'gateway_endpoint_error',
            errorMessage: 'Unknown Error occurred while fetching data from Rucio Server',
            errorName: 'Unknown Error',
        }
        return Promise.resolve(dto)
    }

    createDTO(data: TRucioAccountInfo): AccountInfoDTO {
        const dto: AccountInfoDTO =convertToAccountInfoDTO(data)
        return dto
    }
}