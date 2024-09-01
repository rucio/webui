import GetAccountRSELimits from '@/lib/infrastructure/gateway/account-gateway/endpoints/get-account-rse-limits-endpoint';
import { AccountAttributesDTO, AccountInfoDTO, AccountRSELimitDTO, ListAccountRSEUsageDTO } from '../../dto/account-dto';

export default interface AccountGatewayOutputPort {
    listAccountAttributes(account: string, rucioAuthToken: string): Promise<AccountAttributesDTO>;
    listAccountRSEUsage(account: string, rucioAuthToken: string): Promise<ListAccountRSEUsageDTO>;
    getAccountInfo(account: string, rucioAuthToken: string): Promise<AccountInfoDTO>;
    getAccountRSELimits(account: string, rucioAuthToken: string): Promise<AccountRSELimitDTO>;
}
