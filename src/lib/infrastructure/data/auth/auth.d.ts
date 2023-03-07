export type AuthViewModel = {
    status: 'success' | 'error';
    message?: string;
    error_cause?: string;
    redirectTo?: string;
    rucioIdentity: string;
    rucioAccount: string;
    rucioAuthType: string;
    rucioAuthToken: string;
};

export type x509AuthRequestHeaders  = {
    'X-Rucio-VO': string;
    'X-Rucio-Allow-Return-Multiple-Accounts': boolean = true;
    'X-Rucio-Account'?: string;
    'X-Rucio-AppID'?: string = 'rucio-webui';
}