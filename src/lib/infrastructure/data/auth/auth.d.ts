import { AuthType, Role } from '@/lib/core/entity/auth-models';

export type AuthViewModel = {
    status: 'success' | 'error' | 'multiple_accounts' | 'cannot_determine_account_role';
    message?: string;
    error_cause?: string;
    redirectTo?: string;
    rucioIdentity: string;
    rucioAccount: string;
    rucioMultiAccount?: string;
    rucioAuthType: AuthType | '';
    rucioAuthToken: string;
    rucioAuthTokenExpires: string;
    role: Role | undefined;
    country?: string;
    countryRole?: Role;
    /**
     * Names of every other account mapped to the same Rucio identity. Populated
     * on the userpass success path so the AccountDropdown can offer "switch to X"
     * affordances that trigger a fresh re-auth (#628 lazy-mint design).
     */
    linkedAccountNames?: string[];
};

export type x509AuthRequestHeaders = {
    'X-Rucio-VO': string;
    'X-Rucio-Allow-Return-Multiple-Accounts': boolean;
    'X-Rucio-AppID': string; // Default: 'rucio-webui'
    'X-Rucio-Account'?: string;
};
