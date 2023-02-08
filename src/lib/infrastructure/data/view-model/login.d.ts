export type LoginViewModel = {
    status: 'success' | 'error';
    message?: string;
    redirectTo?: string;
    rucioIdentity: string;
    rucioAccount: string;
    rucioAuthType: string;
    rucioAuthToken: string;
};