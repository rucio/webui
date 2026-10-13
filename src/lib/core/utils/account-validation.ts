import { IdentityType } from '@/lib/core/entity/account';

export const ACCOUNT_NAME_REGEX = /^[a-z0-9-_]{1,25}$/;
export const ACCOUNT_NAME_PATTERN_REGEX = /^[a-z0-9-_*]{1,25}$/; // list filter, allows wildcards
export const ACCOUNT_ATTRIBUTE_REGEX = /^[a-zA-Z0-9\-_\\/.]{1,30}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+$/;

export const isValidAccountName = (s: string): boolean => ACCOUNT_NAME_REGEX.test(s);
export const isValidAccountAttribute = (s: string): boolean => ACCOUNT_ATTRIBUTE_REGEX.test(s);
export const isValidEmail = (s: string): boolean => EMAIL_REGEX.test(s);
export const toAttributeValueString = (v: string | boolean): string => (typeof v === 'boolean' ? (v ? 'True' : 'False') : v);

export const IDENTITY_TYPE_HINTS: Record<Exclude<IdentityType, IdentityType.UNKNOWN>, { label: string; placeholder: string; help: string; multiline?: boolean }> = {
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
