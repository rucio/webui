import {
    AccountAttributeListDTO,
    AccountAttributesDTO,
    AccountGlobalLimitDTO,
    AccountGlobalUsageDTO,
    AccountIdentityListDTO,
    AccountInfoDTO,
    AccountMutationDTO,
    AccountRSELimitDTO,
    ListAccountRSEUsageDTO,
    ListAccountsDTO,
    ListAccountsForIdentityDTO,
} from '../../dto/account-dto';
import { AccountLimitLocality, AccountListFilter, AccountUpdateOptions, IdentityType } from '../../entity/account';
import { AccountType } from '../../entity/rucio';

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

    listAccounts(rucioAuthToken: string, filter: AccountListFilter): Promise<ListAccountsDTO>;
    getAccountAttributes(rucioAuthToken: string, account: string): Promise<AccountAttributeListDTO>;
    listAccountIdentities(rucioAuthToken: string, account: string): Promise<AccountIdentityListDTO>;
    getAccountGlobalLimits(rucioAuthToken: string, account: string): Promise<AccountGlobalLimitDTO>;
    listAccountGlobalUsage(rucioAuthToken: string, account: string): Promise<AccountGlobalUsageDTO>;

    createAccount(rucioAuthToken: string, account: string, accountType: AccountType, email: string | null): Promise<AccountMutationDTO>;
    updateAccount(rucioAuthToken: string, account: string, options: AccountUpdateOptions): Promise<AccountMutationDTO>;
    deleteAccount(rucioAuthToken: string, account: string): Promise<AccountMutationDTO>;

    addAccountAttribute(rucioAuthToken: string, account: string, key: string, value: string): Promise<AccountMutationDTO>;
    deleteAccountAttribute(rucioAuthToken: string, account: string, key: string): Promise<AccountMutationDTO>;

    addAccountIdentity(
        rucioAuthToken: string,
        account: string,
        identity: string,
        type: IdentityType,
        email: string,
        password?: string,
        isDefault?: boolean,
    ): Promise<AccountMutationDTO>;
    deleteAccountIdentity(rucioAuthToken: string, account: string, identity: string, type: IdentityType): Promise<AccountMutationDTO>;

    setAccountLimit(
        rucioAuthToken: string,
        account: string,
        locality: AccountLimitLocality,
        rseExpression: string,
        bytes: number,
    ): Promise<AccountMutationDTO>;
    deleteAccountLimit(rucioAuthToken: string, account: string, locality: AccountLimitLocality, rseExpression: string): Promise<AccountMutationDTO>;
}
