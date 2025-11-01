import 'reflect-metadata';
import { AuthType, Role } from '@/lib/core/entity/auth-models';
import { SessionUser } from '@/types/next-auth';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import AuthServerGatewayOutputPort from '@/lib/core/port/secondary/auth-server-gateway-output-port';
import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import UserPassLoginUseCase from '@/lib/core/use-case/userpass-login-usecase';
import {
    UserpassLoginRequest,
    UserpassLoginResponse,
    UserpassLoginError,
    UserpassLoginIncomplete,
} from '@/lib/core/usecase-models/userpass-login-usecase-models';
import UserPassLoginOutputPort from '@/lib/core/port/primary/userpass-login-output-port';

/**
 * Custom error type for multiple accounts scenario
 * This will be thrown so NextAuth can return it to the frontend
 */
export class MultipleAccountsError extends Error {
    availableAccounts: string;
    constructor(accounts: string) {
        super('Multiple accounts available');
        this.name = 'MultipleAccountsError';
        this.availableAccounts = accounts;
    }
}

/**
 * Custom presenter for NextAuth that doesn't need IronSession
 * It works with Promises instead of HTTP responses
 */
class NextAuthUserPassLoginPresenter implements UserPassLoginOutputPort<Promise<void>> {
    response: Promise<void>;
    private resolvePromise: (value: SessionUser | null) => void;
    private rejectPromise: (reason: any) => void;

    constructor(resolve: (value: SessionUser | null) => void, reject: (reason: any) => void) {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
        this.response = Promise.resolve();
    }

    async presentSuccess(response: UserpassLoginResponse): Promise<void> {
        console.log('[LOGIN FLOW 14] Presenter presentSuccess called', {
            rucioAccount: response.rucioAccount,
            rucioIdentity: response.rucioIdentity,
            vo: response.vo,
            role: response.role,
            tokenExpires: response.rucioAuthTokenExpires
        });

        const sessionUser: SessionUser = {
            id: `${response.rucioAccount}@${response.vo}`, // Create unique ID from account and VO
            email: '', // Not used in Rucio authentication
            emailVerified: null, // Not used in Rucio authentication
            rucioIdentity: response.rucioIdentity,
            rucioAccount: response.rucioAccount,
            rucioAuthType: AuthType.USERPASS,
            rucioAuthToken: response.rucioAuthToken,
            rucioAuthTokenExpires: response.rucioAuthTokenExpires,
            rucioOIDCProvider: null,
            rucioVO: response.vo,
            role: response.role || Role.USER,
            country: response.country,
            countryRole: response.countryRole,
            isLoggedIn: true,
        };
        this.resolvePromise(sessionUser);
    }

    async presentError(error: UserpassLoginError): Promise<void> {
        console.error('[LOGIN FLOW 15] Presenter presentError called', {
            type: error.type,
            message: error.message
        });
        console.error('UserPass login error:', error);
        this.resolvePromise(null);
    }

    async presentIncomplete(incomplete: UserpassLoginIncomplete): Promise<void> {
        console.log('[LOGIN FLOW 16] Presenter presentIncomplete called (multiple accounts)', {
            availableAccounts: incomplete.availableAccounts
        });
        // Handle multiple accounts scenario
        // Reject with a special error that contains the available accounts
        // The frontend can catch this and show the account selection modal
        console.log('Multiple accounts available:', incomplete.availableAccounts);
        this.rejectPromise(new MultipleAccountsError(incomplete.availableAccounts));
    }
}

/**
 * Adapter for NextAuth UserPass authentication.
 * Creates the UserPassLoginUseCase directly without going through the factory,
 * using a custom presenter that works with Promises instead of IronSession.
 */
export async function authorizeUserPass(
    username: string,
    password: string,
    account: string,
    vo: string,
): Promise<SessionUser | null> {
    console.log('[LOGIN FLOW 8] authorizeUserPass started', {
        username,
        account: account || '(none)',
        vo
    });

    return new Promise((resolve, reject) => {
        (async () => {
            try {
                // Get the gateways from IoC container
                const rucioAuthServer = appContainer.get<AuthServerGatewayOutputPort>(GATEWAYS.AUTH_SERVER);
                const rucioAccountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
                const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);

                // Create our custom presenter
                const presenter = new NextAuthUserPassLoginPresenter(resolve, reject);

                // Create the use case directly with our presenter
                const useCase = new UserPassLoginUseCase(presenter, rucioAuthServer, rucioAccountGateway, envConfigGateway);

                console.log('[LOGIN FLOW 9] Executing UserPassLoginUseCase');

                // Execute the use case (await it since it's async)
                const requestModel: UserpassLoginRequest = {
                    username: username,
                    password: password,
                    account: account,
                    vo: vo,
                    redirectTo: '/dashboard',
                };

                await useCase.execute(requestModel);
            } catch (error) {
                console.error('Error in authorizeUserPass:', error);
                if (error instanceof MultipleAccountsError) {
                    reject(error);
                } else {
                    resolve(null);
                }
            }
        })();
    });
}
