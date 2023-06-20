import { AuthType, Role, SessionUser } from "@/lib/core/entity/auth-models";
import { addOrUpdateSessionUser } from "@/lib/infrastructure/auth/session-utils";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { ISwitchAccountController } from "@/lib/infrastructure/controller/switch-account-controller";
import { getIronSession } from "iron-session";
import { createMocks } from "node-mocks-http";

describe('Switch Account API Test', () => {
    it('should switch to existing account in the session and redirect', async () => {
        const { req, res } = createMocks({
            url: 'http://testhost:3000/api/site-header',
        });
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })

        res.redirect = jest.fn()

        const mockUser: SessionUser = {
            rucioIdentity: 'ddmlab',
            rucioAccount: 'root',
            rucioAuthToken: 'rucio-ddmlab-askdjljioj',
            rucioAuthTokenExpires: '2021-09-01T00:00:00.000Z',
            rucioAuthType: AuthType.USERPASS,
            rucioOIDCProvider: '',
            rucioVO: 'def',
            country: 'US',
            role: Role.ADMIN,
            countryRole: Role.ADMIN,
            isLoggedIn: true,
        }

        const mockUser2: SessionUser = {
            rucioIdentity: 'maany',
            rucioAccount: 'dev',
            rucioAuthToken: 'rucio-maany-askdjljioj',
            rucioAuthTokenExpires: '2021-09-01T00:00:00.000Z',
            rucioAuthType: AuthType.x509,
            rucioOIDCProvider: '',
            rucioVO: 'def',
            country: 'US',
            role: Role.ADMIN,
            countryRole: Role.ADMIN,
            isLoggedIn: true,
        }

        await addOrUpdateSessionUser(session, mockUser2)
        await addOrUpdateSessionUser(session, mockUser)

        expect(session.user?.rucioIdentity).toBe('ddmlab')

        const switchAccountController: ISwitchAccountController = appContainer.get(CONTROLLERS.SWITCH_ACCOUNT)
        await switchAccountController.handle(
            session,
            res as undefined as NextApiRequest,
            mockUser2.rucioIdentity,
            mockUser2.rucioAccount,
            mockUser2.rucioAuthType, 
            '/rse'
        );
        
        expect(session.user?.rucioIdentity).toBe('maany')
        expect(res.redirect).toBeCalledWith('/rse')
    });
    it('should not switch to non-existing account', async() => {
        const { req, res } = createMocks({
            url: 'http://testhost:3000/api/site-header',
        });
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })

        res.redirect = jest.fn()

        const mockUser: SessionUser = {
            rucioIdentity: 'ddmlab',
            rucioAccount: 'root',
            rucioAuthToken: 'rucio-ddmlab-askdjljioj',
            rucioAuthTokenExpires: '2021-09-01T00:00:00.000Z',
            rucioAuthType: AuthType.USERPASS,
            rucioOIDCProvider: '',
            rucioVO: 'def',
            country: 'US',
            role: Role.ADMIN,
            countryRole: Role.ADMIN,
            isLoggedIn: true,
        }

        const mockUser2: SessionUser = {
            rucioIdentity: 'maany',
            rucioAccount: 'dev',
            rucioAuthToken: 'rucio-maany-askdjljioj',
            rucioAuthTokenExpires: '2021-09-01T00:00:00.000Z',
            rucioAuthType: AuthType.x509,
            rucioOIDCProvider: '',
            rucioVO: 'def',
            country: 'US',
            role: Role.ADMIN,
            countryRole: Role.ADMIN,
            isLoggedIn: true,
        }

        await addOrUpdateSessionUser(session, mockUser)

        const switchAccountController: ISwitchAccountController = appContainer.get(CONTROLLERS.SWITCH_ACCOUNT)
        await switchAccountController.handle(
            session,
            res as undefined as NextApiRequest,
            mockUser2.rucioIdentity,
            mockUser2.rucioAccount,
            mockUser2.rucioAuthType, 
            '/rse'
        );

        expect(res._getStatusCode()).toBe(500)
        const data = JSON.parse(res._getData())
        expect(data.error).toBe('Cannot switch to non-existing/logged-in account')

    })
});