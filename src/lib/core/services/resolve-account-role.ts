import { Role } from '../entity/auth-models';
import { TAccountAttributes } from '../dto/account-dto';

export interface AccountRoleInfo {
    role: Role;
    country: string | undefined;
    countryRole: Role | undefined;
}

/**
 * Derives role, country, and countryRole from Rucio account attributes.
 *
 * Used by all login flows (userpass, x509, OIDC) to ensure consistent
 * role assignment from Rucio account attributes.
 *
 * - `admin` attribute set to `'True'` → Role.ADMIN
 * - `country-*` attributes → sets country and countryRole
 * - Any other attribute → Role.USER (default)
 */
export function resolveAccountRole(attributes: TAccountAttributes): AccountRoleInfo {
    let isAdmin = false;
    let country: string | undefined;
    let countryRole: Role | undefined;

    attributes.forEach(attr => {
        if (attr.key === 'admin' && (attr.value === 'True' || attr.value === true)) {
            isAdmin = true;
        } else if (attr.key.startsWith('country-')) {
            country = attr.key.split('-')[1];
            if (attr.value === 'admin') {
                countryRole = Role.ADMIN;
            } else if (attr.value === 'user') {
                countryRole = Role.USER;
            } else {
                countryRole = undefined;
            }
        }
    });

    return { role: isAdmin ? Role.ADMIN : Role.USER, country, countryRole };
}
