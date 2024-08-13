import { AccountAttributeErrorTypesDTO, AccountAttributesDTO, AccountInfoDTO, AccountRSELimitDTO, AccountRSEUsageDTO, ListAccountRSEUsageDTO, TAccountAttributes } from "@/lib/core/dto/account-dto";
import AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port";
import type EnvConfigGatewayOutputPort from "@/lib/core/port/secondary/env-config-gateway-output-port";
import { inject, injectable } from "inversify";
import GATEWAYS from "../../ioc/ioc-symbols-gateway";
import GetAccountInfoEndpoint from "./endpoints/get-account-info-endpoint";
import GetAccountRSELimits from "./endpoints/get-account-rse-limits-endpoint";
import ListAccountRSEUsageEndpoint from "./endpoints/list-account-rse-usage-endpoint";

@injectable()
export default class RucioAccountGateway implements AccountGatewayOutputPort {
    constructor(
        @inject(GATEWAYS.ENV_CONFIG) private envConfigGateway: EnvConfigGatewayOutputPort,
    ) {
        this.envConfigGateway = envConfigGateway;
    }
    
    async getAccountInfo(account: string, rucioAuthToken: string): Promise<AccountInfoDTO> {
        const endpoint: GetAccountInfoEndpoint = new GetAccountInfoEndpoint(rucioAuthToken, account)
        const dto: AccountInfoDTO = await endpoint.fetch()
        return dto
    }
    
    async getAccountRSELimits(account: string, rucioAuthToken: string): Promise<AccountRSELimitDTO> {
        const endpoint: GetAccountRSELimits = new GetAccountRSELimits(rucioAuthToken, account)
        const dto: AccountRSELimitDTO = await endpoint.fetch()
        return dto
    }
    async listAccountRSEUsage(account: string, rucioAuthToken: string): Promise<ListAccountRSEUsageDTO> {
        const endpoint: ListAccountRSEUsageEndpoint = new ListAccountRSEUsageEndpoint(rucioAuthToken, account)
        const errorDTO: ListAccountRSEUsageDTO | undefined = await endpoint.fetch()
        if(!errorDTO) {
            return {
                status: 'success',
                stream: endpoint
            }
        }
        return errorDTO
    }

    generateErrorResponse(error: AccountAttributeErrorTypesDTO, account: string, message: string): AccountAttributesDTO {
        return {
            status: 'error',
            error: error,
            account: account,
            attributes: {},
            message: message
        } as AccountAttributesDTO
    }

    async listAccountAttributes(account: string, rucioAuthToken: string): Promise<AccountAttributesDTO> {
        let rucioHost = null;
        
        try {
            rucioHost = await this.envConfigGateway.rucioHost();
        } catch (error: Error | any) {
            return Promise.reject(
                this.generateErrorResponse(AccountAttributeErrorTypesDTO.RUCIO_HOST_NOT_CONFIGURED, account, error.message)
            )
        }

        const accountEndpoint = '/accounts/' + account + '/attr';
        const url = rucioHost + accountEndpoint;

        let response = null;
        try {
            response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Rucio-Auth-Token': rucioAuthToken,
                },
            })
        } catch (error: Error | any) {
            return Promise.reject(
                this.generateErrorResponse(AccountAttributeErrorTypesDTO.RUCIO_SERVER_DID_NOT_RETURN_A_RESPONSE, account, error.message)
            )
        }

        if (!response) {
            return Promise.reject(
                this.generateErrorResponse(AccountAttributeErrorTypesDTO.RUCIO_SERVER_DID_NOT_RETURN_A_RESPONSE, account, 'Rucio Server did not return a response')
            )
        }

        if (response.status === 401) {
            return Promise.reject(
                this.generateErrorResponse(AccountAttributeErrorTypesDTO.RUCIO_AUTH_TOKEN_IS_INVALID_OR_EXPIRED, account, 'Rucio Auth Token is invalid or expired')
            )
        } else if (response.status !== 200) {
            return Promise.reject(
                this.generateErrorResponse(AccountAttributeErrorTypesDTO.UNKNOWN_ERROR, account, 'Unknown Error')
            )
        }

        let data: TAccountAttributes = []

        try {
            data = await response.json()
        } catch (error: Error | any) {
            return Promise.reject(
                this.generateErrorResponse(AccountAttributeErrorTypesDTO.CANNOT_PARSE_RESPONSE_FROM_RUCIO_SERVER, account, error.message)
            )
        }

        if(!data || data.length === 0) {
            return Promise.reject(
                this.generateErrorResponse(AccountAttributeErrorTypesDTO.NO_ATTRIBUTES_FOUND_FOR_ACCOUNT, account, 'No attributes found for account')
            )
        }


        const dto: AccountAttributesDTO = {
            status: 'success',
            account: account,
            attributes: data,
        }
        return Promise.resolve(dto)
    }
}