import { AccountUpdateOptions, IdentityType } from '@/lib/core/entity/account';
import { AccountStatus, AccountType } from '@/lib/core/entity/rucio';
import type { BaseErrorResponseModel } from '@/lib/sdk/usecase-models';

export const ACCOUNT_NAME_REGEX = /^[a-z0-9-_]{1,25}$/;
export const ACCOUNT_NAME_PATTERN_REGEX = /^[a-z0-9-_*]{1,25}$/; // list filter, allows wildcards
export const ACCOUNT_ATTRIBUTE_REGEX = /^[a-zA-Z0-9\-_\\/.]{1,30}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+$/;

export const isValidAccountName = (s: string): boolean => ACCOUNT_NAME_REGEX.test(s);
export const isValidAccountAttribute = (s: string): boolean => ACCOUNT_ATTRIBUTE_REGEX.test(s);
export const isValidEmail = (s: string): boolean => EMAIL_REGEX.test(s);
export const toAttributeValueString = (v: string | boolean): string => (typeof v === 'boolean' ? (v ? 'True' : 'False') : v);

/*
 * Domain checks for the account mutation use cases. The routes enforce the same rules with zod; the use
 * cases repeat them to protect other callers. Each check returns a message, or undefined when valid.
 */

const ACCOUNT_TYPES: string[] = [AccountType.USER, AccountType.GROUP, AccountType.SERVICE];
const IDENTITY_TYPES: string[] = Object.values(IdentityType).filter(t => t !== IdentityType.UNKNOWN);
const UPDATE_STATUSES: string[] = [AccountStatus.ACTIVE, AccountStatus.SUSPENDED];
const UPDATE_OPTION_KEYS = ['email', 'status', 'accountType'];

// typeof guards: RegExp.test coerces undefined to the string 'undefined', which would pass.
export const checkAccountName = (account: string): string | undefined =>
    typeof account === 'string' && isValidAccountName(account) ? undefined : 'Invalid account name';

export const checkAccountType = (accountType: string): string | undefined =>
    ACCOUNT_TYPES.includes(accountType) ? undefined : 'Account type must be USER, GROUP or SERVICE';

export const checkEmail = (email: string): string | undefined => (typeof email === 'string' && isValidEmail(email) ? undefined : 'Invalid email');

/** A null or missing email is allowed (create and update accept null). */
export const checkOptionalEmail = (email: string | null | undefined): string | undefined =>
    email === null || email === undefined ? undefined : checkEmail(email);

export const checkAttribute = (part: 'key' | 'value', s: string): string | undefined =>
    typeof s === 'string' && isValidAccountAttribute(s) ? undefined : `Invalid attribute ${part}`;

export const checkIdentity = (identity: string, authType: string): string | undefined => {
    if (typeof identity !== 'string' || !identity.trim()) return 'Identity is required';
    return IDENTITY_TYPES.includes(authType) ? undefined : 'Invalid identity type';
};

export const checkRseExpression = (rseExpression: string): string | undefined =>
    typeof rseExpression === 'string' && rseExpression.trim() ? undefined : 'RSE expression is required';

export const checkBytes = (bytes: number): string | undefined =>
    Number.isInteger(bytes) && bytes >= -1 ? undefined : 'Bytes must be an integer, -1 (unlimited) or greater';

export const checkUpdateOptions = (options: AccountUpdateOptions): string | undefined => {
    const keys = Object.keys(options ?? {});
    if (keys.length === 0) return 'Provide at least one of email, status or accountType';
    if (keys.some(k => !UPDATE_OPTION_KEYS.includes(k))) return 'Only email, status and accountType can be updated';
    if (options.status !== undefined && !UPDATE_STATUSES.includes(options.status)) return 'Status must be ACTIVE or SUSPENDED';
    const typeError = options.accountType !== undefined ? checkAccountType(options.accountType) : undefined;
    return typeError ?? checkOptionalEmail(options.email);
};

/** The error model a use case returns for a failed check; presenters map it to `validation_error`. */
export const toValidationError = <T extends BaseErrorResponseModel>(...checks: (string | undefined)[]): T | undefined => {
    const message = checks.find(m => m !== undefined);
    return message === undefined ? undefined : ({ status: 'error', code: 400, name: 'ValidationError', message } as T);
};

export const IDENTITY_TYPE_HINTS: Record<
    Exclude<IdentityType, IdentityType.UNKNOWN>,
    { label: string; placeholder: string; help: string; multiline?: boolean }
> = {
    [IdentityType.X509]: {
        label: 'X509 certificate',
        placeholder: 'CN=Jane Doe,OU=Users,DC=example,DC=org',
        help: 'The certificate DN. Rucio compares DNs exactly, so you may need to add both the CN=...,DC=... and the /DC=.../CN=... forms.',
    },
    [IdentityType.OIDC]: {
        label: 'OIDC',
        placeholder: 'SUB=1234-abcd, ISS=https://iam.example.org/',
        help: 'Subject and issuer, separated by a comma and a space. A trailing slash on the issuer makes it a different identity.',
    },
    [IdentityType.USERPASS]: {
        label: 'Username and password',
        placeholder: 'jdoe',
        help: 'A username. The password is only used if this username does not exist in Rucio yet.',
    },
    [IdentityType.GSS]: {
        label: 'Kerberos (GSS)',
        placeholder: 'jdoe@EXAMPLE.ORG',
        help: 'The Kerberos principal.',
    },
    [IdentityType.SSH]: {
        label: 'SSH key',
        placeholder: 'ssh-ed25519 AAAA... jdoe@host',
        help: 'The full public key.',
        multiline: true,
    },
    [IdentityType.SAML]: {
        label: 'SAML',
        placeholder: 'jdoe@example.org',
        help: 'The SAML subject.',
    },
};
