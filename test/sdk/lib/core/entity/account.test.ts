import { IDENTITY_TYPES, IdentityType } from '@/lib/core/entity/account';

describe('IDENTITY_TYPES', () => {
    it('lists the real Rucio identity types, without UNKNOWN', () => {
        expect([...IDENTITY_TYPES]).toEqual(['X509', 'GSS', 'USERPASS', 'SSH', 'SAML', 'OIDC']);
        expect(IDENTITY_TYPES).not.toContain(IdentityType.UNKNOWN);
    });
});
