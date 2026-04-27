import { AccountAttributesDTO, AccountInfoDTO, AccountRSELimitDTO, ListAccountRSEUsageDTO, ListAccountsForIdentityDTO } from '../../dto/account-dto';

export default interface AccountGatewayOutputPort {
    listAccountAttributes(account: string, rucioAuthToken: string): Promise<AccountAttributesDTO>;
    listAccountRSEUsage(account: string, rucioAuthToken: string): Promise<ListAccountRSEUsageDTO>;
    getAccountInfo(account: string, rucioAuthToken: string): Promise<AccountInfoDTO>;
    getAccountRSELimits(account: string, rucioAuthToken: string): Promise<AccountRSELimitDTO>;
    /**
     * Returns all Rucio account names mapped to a given identity.
     * Uses GET /identities/accounts?identity_key={identity}&type={identityType}
     */
    listAccountsForIdentity(identity: string, identityType: string, rucioAuthToken: string): Promise<ListAccountsForIdentityDTO>;
}
