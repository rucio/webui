import { LoginConfigResponse } from '@/lib/core/usecase-models/login-config-usecase-models';

export interface LoginViewModel extends LoginConfigResponse {
    isLoggedIn: boolean;
    accountActive: string | undefined;
    accountsAvailable: string[] | undefined;
    status: 'success' | 'error';
    message?: string;
    rucioAuthHost: string;
}
