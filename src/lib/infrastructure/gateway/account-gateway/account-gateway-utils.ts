import { AccountInfoDTO, AccountRSEUsageDTO } from "@/lib/core/dto/account-dto";
import { AccountStatus, AccountType } from "@/lib/core/entity/rucio";

/**
 * Represents the Rucio response for {@link ListAccountRSEUsageEndpoint}
 */
export type TRucioAccountRSEUsage = {
    rse_id: string;
    rse: string;
    bytes: number;
    files: number;
    bytes_limit: number;
    bytes_remaining: number;
}

export type TRucioAccountInfo = {
    status: string;
    account: string;
    account_type: string;
    email: null | string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    suspended_at: null | string;
}

/**
 * Converts the {@link TRucioAccountRSEUsage} object returned by Rucio Server to {@link AccountRSEUsageDTO} object
 * @param data The {@link TRucioAccountRSEUsage} object returned by Rucio Server
 * @param account The account for which the usage is being retrieved
 * @returns equivalent {@link AccountRSEUsageDTO} object
 */
export function convertToAccountRSEUsageDTO(data: TRucioAccountRSEUsage, account: string): AccountRSEUsageDTO {
    const dto: AccountRSEUsageDTO = {
        status: 'success',
        account: account,
        rse_id: data.rse_id,
        rse: data.rse,
        used_bytes: data.bytes,
        files: data.files,
        bytes_limit: data.bytes_limit,
    }
    return dto
}

function getAccountType(accountType: string): AccountType {
    const cleanedAccountType = accountType.toUpperCase().trim()
    switch(cleanedAccountType) {
        case 'USER':
            return AccountType.USER
        case 'GROUP':
            return AccountType.GROUP
        case 'SERVICE':
            return AccountType.SERVICE
        default:
            return AccountType.UNKNOWN
    }
}

function getAccountStatus(accountStatus: string): AccountStatus {
    const cleanedAccountStatus = accountStatus.toUpperCase().trim()
    switch(cleanedAccountStatus) {
        case 'ACTIVE':
            return AccountStatus.ACTIVE
        case 'DELETED':
            return AccountStatus.DELETED
        case 'SUSPENDED':
            return AccountStatus.SUSPENDED
        default:
            return AccountStatus.UNKNOWN
    }
}

export function getEmptyAccountInfoDTO(): AccountInfoDTO {
    return {
        status: 'error',
        account: '',
        accountType: AccountType.UNKNOWN,
        accountStatus: AccountStatus.UNKNOWN,
        email: '',
        createdAt: '',
        updatedAt: '',
        deletedAt: undefined,
        suspendedAt: undefined,
    }
}
export function convertToAccountInfoDTO(data: TRucioAccountInfo): AccountInfoDTO {
    const dto: AccountInfoDTO = {
        status: 'success',
        account: data.account,
        accountType: getAccountType(data.account_type),
        accountStatus: getAccountStatus(data.status),
        email: data.email ?? "",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        deletedAt: data.deleted_at ?? undefined,
        suspendedAt: data.suspended_at ?? undefined,
    }
    return dto
}