import { AccountStatus, AccountType } from './rucio';

export enum IdentityType {
    X509 = 'X509',
    GSS = 'GSS',
    USERPASS = 'USERPASS',
    SSH = 'SSH',
    SAML = 'SAML',
    OIDC = 'OIDC',
    UNKNOWN = 'UNKNOWN',
}

export interface AccountListItem {
    account: string;
    accountType: AccountType;
    email: string | null;
}

export interface AccountAttribute {
    key: string;
    value: string | boolean;
}

export interface AccountIdentity {
    identity: string;
    type: IdentityType;
    email: string;
}

/** bytesLimit: -1 unlimited, null no limit row. */
export interface AccountLocalQuota {
    rse: string;
    rseId?: string;
    bytesLimit: number | null;
    bytesUsed: number;
    files: number;
    bytesRemaining: number | null;
}

export interface AccountGlobalQuota {
    rseExpression: string;
    resolvedRses: string[];
    bytesLimit: number | null;
    bytesUsed: number;
    files: number;
    bytesRemaining: number | null;
}

export type AccountLimitLocality = 'local' | 'global';

export interface AccountUpdateOptions {
    email?: string | null;
    status?: AccountStatus.ACTIVE | AccountStatus.SUSPENDED;
    accountType?: AccountType;
}

export interface AccountListFilter {
    account?: string;
    accountType?: AccountType;
    identity?: string;
}

export const UNLIMITED_BYTES = -1;
