import { AuthType, Role, SessionUser } from "@/lib/core/entity/auth-models";

export interface UserpassLoginV2ViewModel {
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
    sessionUser?: SessionUser,
}


export interface x509AuthRequestHeadersV2 {
    'X-Rucio-VO': string;
    'X-Rucio-Allow-Return-Multiple-Accounts': boolean;
    'X-Rucio-AppID': string
    'X-Rucio-Account'?: string;

}


export const getEmptyUserpassLoginV2ViewModel = (): UserpassLoginV2ViewModel => {

    return {
        status: 'error',
        rucioIdentity: '',
        rucioAccount: '',
        rucioAuthType: '',
        rucioAuthToken: '',
        rucioAuthTokenExpires: '',
        role: undefined,

    } as UserpassLoginV2ViewModel

}


export const getEmptyx509AuthRequestHeadersV2 = (): x509AuthRequestHeadersV2 => {

    return {
        'X-Rucio-VO': '',
        'X-Rucio-Allow-Return-Multiple-Accounts': false,
        'X-Rucio-AppID': 'rucio-webui',
    } as x509AuthRequestHeadersV2

}
