import { LoginConfigResponse } from "@/lib/core/data/login-config-usecase-models"

export interface LoginViewModel extends LoginConfigResponse {
    isLoggedIn: boolean;
    status: 'success' | 'error';
    message?: string;
    rucioAuthHost: string;
}