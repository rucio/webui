import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto';
import { AccountAttribute, AccountGlobalQuota, AccountIdentity, AccountListItem, AccountLocalQuota } from '../entity/account';
import { AccountInfo, RSEAccountUsage } from '../entity/rucio';

type TAccountAttribute = {
    key: string;
    value: string | boolean;
};

export type TAccountAttributes = TAccountAttribute[];

/**
 * Account Attributes DTO to store the response from /accounts/<account>/attr/ endpoint
 */
export type AccountAttributesDTO = {
    account: string;
    attributes: TAccountAttributes;
    status: 'OK' | 'ERROR';
    error?: AccountAttributeErrorTypesDTO;
    message?: string;
};
export enum AccountAttributeErrorTypesDTO {
    RUCIO_HOST_NOT_CONFIGURED = 'RucioHost Not Configured',
    RUCIO_SERVER_DID_NOT_RETURN_A_RESPONSE = 'Rucio Server did not return a response',
    RUCIO_AUTH_TOKEN_IS_INVALID_OR_EXPIRED = 'Rucio Auth Token is invalid or expired',
    CANNOT_PARSE_RESPONSE_FROM_RUCIO_SERVER = 'Cannot parse response from Rucio Server',
    NO_ATTRIBUTES_FOUND_FOR_ACCOUNT = 'No attributes found for account',
    UNKNOWN_ERROR = 'Unknown Error',
}

/**
 * DTO for storing the response from /accounts/<account>/rse-usage/ endpoint
 */
export interface ListAccountRSEUsageDTO extends BaseStreamableDTO {}

/**
 * DTO for storing individually streamed RSE Usage for an account
 */
export interface AccountRSEUsageDTO extends BaseDTO, RSEAccountUsage {}

/**
 * DTO for storing the response from /accounts/<account>/ endpoint. Contains information
 * about the account
 */
export interface AccountInfoDTO extends BaseDTO, AccountInfo {}

/**
 * A DTO containing the data field which is a record of key-value pairs.
 * The key is the name of the RSE and the value is the limit of the RSE in bytes for a given account
 */
export interface AccountRSELimitDTO extends BaseDTO {
    account: string;
    limits: Record<string, number>;
}

/**
 * DTO for storing the response from GET /identities/accounts endpoint.
 * Returns all Rucio accounts mapped to a given identity.
 */
export type ListAccountsForIdentityDTO = {
    status: 'success' | 'error';
    accounts: string[];
    message?: string;
};

/**
 * A single account streamed from GET /accounts/
 */
export interface AccountListItemDTO extends BaseDTO, AccountListItem {}

/**
 * DTO for storing the response from GET /accounts/ (streamed)
 */
export interface ListAccountsDTO extends BaseStreamableDTO {}

/**
 * DTO for storing the response from GET /accounts/<account>/attr/
 */
export interface AccountAttributeListDTO extends BaseDTO {
    account: string;
    attributes: AccountAttribute[];
}

/**
 * DTO for storing the response from GET /accounts/<account>/identities
 */
export interface AccountIdentityListDTO extends BaseDTO {
    account: string;
    identities: AccountIdentity[];
}

/**
 * DTO for storing the response from GET /accounts/<account>/limits/global.
 * Keyed by RSE expression. A limit of -1 means unlimited.
 */
export interface AccountGlobalLimitDTO extends BaseDTO {
    account: string;
    limits: Record<string, { resolvedRses: string[]; limit: number }>;
}

/**
 * DTO for storing the response from GET /accounts/<account>/usage/global. A bytesLimit of -1 means unlimited.
 */
export interface AccountGlobalUsageDTO extends BaseDTO {
    account: string;
    usage: { rseExpression: string; bytes: number; files: number; bytesLimit: number; bytesRemaining: number }[];
}

/**
 * DTO for account mutations (create/update/delete/add/del/set). Rucio returns `Created` text or an empty body.
 */
export interface AccountMutationDTO extends BaseDTO {}

/**
 * Synthetic DTO assembled by the GetAccountQuotas use case from the local limits, local usage,
 * global limits and global usage endpoints.
 */
export interface AccountQuotasDTO extends BaseDTO {
    account: string;
    local: AccountLocalQuota[];
    global: AccountGlobalQuota[];
}
