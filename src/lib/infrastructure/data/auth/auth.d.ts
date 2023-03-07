export type AuthViewModel = {
    status: 'success' | 'error' | 'multiple_accounts';
    message?: string;
    error_cause?: string;
    redirectTo?: string;
    rucioIdentity: string;
    rucioAccount: string;
    rucioAuthType: string;
    rucioAuthToken: string;
    rucioAuthTokenExpires: string;
};

export type x509AuthRequestHeaders  = {
    'X-Rucio-VO': string;
    'X-Rucio-Allow-Return-Multiple-Accounts': boolean;
    'X-Rucio-AppID': string = 'rucio-webui';
    'X-Rucio-Account'?: string;
}