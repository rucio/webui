import { AccountAttributesDTO, AccountInfoDTO, AccountRSEUsageDTO, ListAccountRSEUsageDTO } from "../../dto/account-dto";

export default interface AccountGatewayOutputPort {
    listAccountAttributes(account: string, rucioAuthToken: string): Promise<AccountAttributesDTO>
    listAccountRSEUsage(account: string, rucioAuthToken: string): Promise<ListAccountRSEUsageDTO>
    getAccountInfo(account: string, rucioAuthToken: string): Promise<AccountInfoDTO>
}