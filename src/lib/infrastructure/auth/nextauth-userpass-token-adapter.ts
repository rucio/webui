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
 * Presenter for building a USERPASS SessionUser from a pre-validated Rucio token.
 * Reuses SetX509LoginSessionUseCase (token-to-session logic is auth-type-agnostic);
 * only the final rucioAuthType differs from x509.
 */
class NextAuthUserPassTokenPresenter implements SetX509LoginSessionOutputPort<Promise<void>> {
    response: Promise<void>;
    private resolvePromise: (value: SessionUser | null) => void;

    constructor(resolve: (value: SessionUser | null) => void) {
        this.resolvePromise = resolve;
        this.response = Promise.resolve();
    }

    async presentSuccess(response: SetX509LoginSessionResponse): Promise<void> {
        const sessionUser: SessionUser = {
            id: `${response.rucioAccount}@${response.vo.shortName}`,
            email: '',
            emailVerified: null,
            rucioIdentity: response.rucioIdentity,
            rucioAccount: response.rucioAccount,
            rucioAuthType: AuthType.USERPASS,
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
        console.error('UserPass token login error:', error);
        this.resolvePromise(null);
    }
}

/**
 * Adapter for NextAuth userpass authentication via a pre-validated Rucio token.
 * Mirrors the x509 pattern: the client probes Rucio's /auth/userpass directly,
 * then hands the resulting token back through NextAuth to establish the session.
 */
export async function authorizeUserPassToken(
    rucioAuthToken: string,
    rucioAccount: string,
    shortVOName: string,
    rucioTokenExpiry: string,
): Promise<SessionUser | null> {
    return new Promise(resolve => {
        (async () => {
            try {
                const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
                const rucioAccountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

                const presenter = new NextAuthUserPassTokenPresenter(resolve);
                const useCase = new SetX509LoginSessionUseCase(presenter, envConfigGateway, rucioAccountGateway);

                const requestModel: SetX509LoginSessionRequest = {
                    rucioAuthToken,
                    rucioAccount,
                    shortVOName,
                    rucioAuthTokenExpires: rucioTokenExpiry,
                };

                await useCase.execute(requestModel);
            } catch (error) {
                console.error('Error in authorizeUserPassToken:', error);
                resolve(null);
            }
        })();
    });
}
