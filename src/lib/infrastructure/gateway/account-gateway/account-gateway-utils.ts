import { AccountInfoDTO, AccountListItemDTO, AccountRSEUsageDTO } from '@/lib/core/dto/account-dto';
import { IdentityType } from '@/lib/core/entity/account';
import { AccountStatus, AccountType, isKnownAccountType } from '@/lib/core/entity/rucio';

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
};

export type TRucioAccountInfo = {
    status: string;
    account: string;
    account_type: string;
    email: null | string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    suspended_at: null | string;
};

export type TRucioAccountListItem = { account: string; type: string; email: string | null };
export type TRucioAccountIdentity = { type: string; identity: string; email: string };
export type TRucioGlobalLimits = Record<string, { resolved_rses: string[]; resolved_rse_ids: string[]; limit: number }>;
export type TRucioGlobalUsage = { rse_expression: string; bytes: number; files: number; bytes_limit: number; bytes_remaining: number };

/**
 * Parses an NDJSON body into objects. Blank lines are skipped and Rucio's non-standard `Infinity` becomes -1.
 */
export function parseNDJSON<T>(text: string): T[] {
    return text
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .map(l => JSON.parse(l.replace(/\bInfinity\b/g, '-1')) as T);
}

/**
 * Parses one chunk emitted by the NDJSON stream parser. The parser forwards each line as a JSON string literal
 * wrapping the line, so the chunk is unwrapped first and the line parsed second.
 */
export function parseStreamedLine<T>(chunk: Buffer | string): T {
    const parsed = JSON.parse(chunk.toString());
    return (typeof parsed === 'string' ? JSON.parse(parsed) : parsed) as T;
}

export function convertToIdentityType(identityType: string): IdentityType {
    const key = identityType.toUpperCase().trim();
    return Object.values(IdentityType).includes(key as IdentityType) ? (key as IdentityType) : IdentityType.UNKNOWN;
}

export function convertToAccountListItemDTO(data: TRucioAccountListItem): AccountListItemDTO {
    return { status: 'success', account: data.account, accountType: getAccountType(data.type), email: data.email ?? null };
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
    };
    return dto;
}

export function getAccountType(accountType: string): AccountType {
    const cleanedAccountType = accountType.toUpperCase().trim();
    return isKnownAccountType(cleanedAccountType) ? cleanedAccountType : AccountType.UNKNOWN;
}

function getAccountStatus(accountStatus: string): AccountStatus {
    const cleanedAccountStatus = accountStatus.toUpperCase().trim();
    switch (cleanedAccountStatus) {
        case 'ACTIVE':
            return AccountStatus.ACTIVE;
        case 'DELETED':
            return AccountStatus.DELETED;
        case 'SUSPENDED':
            return AccountStatus.SUSPENDED;
        default:
            return AccountStatus.UNKNOWN;
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
    };
}
export function convertToAccountInfoDTO(data: TRucioAccountInfo): AccountInfoDTO {
    const dto: AccountInfoDTO = {
        status: 'success',
        account: data.account,
        accountType: getAccountType(data.account_type),
        accountStatus: getAccountStatus(data.status),
        email: data.email ?? '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        deletedAt: data.deleted_at ?? undefined,
        suspendedAt: data.suspended_at ?? undefined,
    };
    return dto;
}
