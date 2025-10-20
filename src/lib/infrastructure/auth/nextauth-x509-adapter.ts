import 'reflect-metadata';
import { AuthType, Role } from '@/lib/core/entity/auth-models';
import { SessionUser } from '@/types/next-auth';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import SetX509LoginSessionUseCase from '@/lib/core/use-case/set-x509-login-session-usecase';
import {
    SetX509LoginSessionRequest,
    SetX509LoginSessionResponse,
    SetX509LoginSessionError,
} from '@/lib/core/usecase-models/set-x509-login-session-usecase-models';
import SetX509LoginSessionOutputPort from '@/lib/core/port/primary/set-x509-login-session-output-port';

/**
 * Custom presenter for NextAuth that doesn't need IronSession
 * It works with Promises instead of HTTP responses
 */
class NextAuthX509LoginPresenter implements SetX509LoginSessionOutputPort<Promise<void>> {
    response: Promise<void>;
    private resolvePromise: (value: SessionUser | null) => void;
    private rejectPromise: (reason: any) => void;

    constructor(resolve: (value: SessionUser | null) => void, reject: (reason: any) => void) {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
        this.response = Promise.resolve();
    }

    async presentSuccess(response: SetX509LoginSessionResponse): Promise<void> {
        const sessionUser: SessionUser = {
            id: `${response.rucioAccount}@${response.vo.shortName}`, // Create unique ID from account and VO
            email: '', // Not used in Rucio authentication
            emailVerified: null, // Not used in Rucio authentication
            rucioIdentity: response.rucioIdentity,
            rucioAccount: response.rucioAccount,
            rucioAuthType: AuthType.x509,
            rucioAuthToken: response.rucioAuthToken,
            rucioAuthTokenExpires: response.rucioAuthTokenExpires,
            rucioOIDCProvider: null,
            rucioVO: response.vo.shortName,
            role: response.role || Role.USER,
            country: response.country,
            countryRole: response.countryRole,
            isLoggedIn: true,
        };
        this.resolvePromise(sessionUser);
    }

    async presentError(error: SetX509LoginSessionError): Promise<void> {
        console.error('x509 login error:', error);
        this.resolvePromise(null);
    }
}

/**
 * Adapter for NextAuth x509 authentication.
 * Creates the SetX509LoginSessionUseCase directly without going through the factory,
 * using a custom presenter that works with Promises instead of IronSession.
 */
export async function authorizeX509(
    rucioAuthToken: string,
    rucioAccount: string,
    shortVOName: string,
    rucioTokenExpiry: string,
): Promise<SessionUser | null> {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                // Get the gateways from IoC container
                const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
                const rucioAccountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

                // Create our custom presenter
                const presenter = new NextAuthX509LoginPresenter(resolve, reject);

                // Create the use case directly with our presenter
                const useCase = new SetX509LoginSessionUseCase(presenter, envConfigGateway, rucioAccountGateway);

                // Execute the use case (await it since it's async)
                const requestModel: SetX509LoginSessionRequest = {
                    rucioAuthToken: rucioAuthToken,
                    rucioAccount: rucioAccount,
                    shortVOName: shortVOName,
                    rucioAuthTokenExpires: rucioTokenExpiry,
                };

                await useCase.execute(requestModel);
            } catch (error) {
                console.error('Error in authorizeX509:', error);
                resolve(null);
            }
        })();
    });
}
