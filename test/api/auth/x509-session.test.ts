import { setEmptySession } from "@/lib/infrastructure/auth/session-utils";
import { getIronSession } from "iron-session";
import { createMocks } from "node-mocks-http";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import { ISetX509LoginSessionController } from "@/lib/infrastructure/controller/set-x509-login-session-controller";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { AuthViewModel } from "@/lib/infrastructure/data/auth/auth";
import { Role } from "@/lib/core/entity/auth-models";

describe('X509Login API Test', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.doMock();

        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, (req) => {
            if(req.url.endsWith('/accounts/root/attr')){
                const rucioToken = req.headers.get('X-Rucio-Auth-Token')
                if(rucioToken !== 'rucio-/C=GB/O=Isode Limited/CN=Steve Kille-askdjljioj') {
                    return Promise.resolve({
                        status: 401,
                    })
                }
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([
                        {
                            "key": "admin",
                            "value": "True"
                        },
                        {
                            "key": "country-tw",
                            "value": "user"
                        }
                    ])
                })   
            } 
        })
    })
    it('should set session user upon successful login via x509 workflow', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                rucioAccount: 'root',
                rucioAuthToken: 'rucio-/C=GB/O=Isode Limited/CN=Steve Kille-askdjljioj',
                rucioTokenExpiry: '2021-09-01T00:00:00.000Z',
                shortVOName: 'def',
            }
        });
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })
        req.session = session
        const requestBody = req.body
        await setEmptySession(session, true)
        const setX509LoginSessionController = appContainer.get<ISetX509LoginSessionController>(CONTROLLERS.SET_X509_LOGIN_SESSION)
        await setX509LoginSessionController.handle(
            session, 
            res, 
            requestBody.rucioAuthToken, 
            requestBody.rucioAccount, 
            requestBody.shortVOName, 
            requestBody.rucioTokenExpiry
        )

        expect(res._getStatusCode()).toBe(200);
        expect(session.user).toHaveProperty('isLoggedIn');
        expect(session.user?.isLoggedIn).toBe(true);
        expect(session.user).toHaveProperty('rucioAuthToken');
        expect(session.user?.rucioAuthToken).toBe('rucio-/C=GB/O=Isode Limited/CN=Steve Kille-askdjljioj');
        expect(session.user).toHaveProperty('rucioAccount');
        expect(session.user?.rucioAccount).toBe('root');
        expect(session.user).toHaveProperty('rucioIdentity')
        expect(session.user?.rucioIdentity).toBe('/C=GB/O=Isode Limited/CN=Steve Kille');
        expect(session.user).toHaveProperty('rucioAuthType')
        expect(session.user?.rucioAuthType).toBe('x509');
        expect(session.user).toHaveProperty('rucioAuthTokenExpires')
        expect(session.user?.rucioAuthTokenExpires).toBe('2021-09-01T00:00:00.000Z');
        expect(session.user).toHaveProperty('role')
        expect(session.user?.role).toBe(Role.ADMIN);
        expect(session.user).toHaveProperty('country')
        expect(session.user?.country).toBe('tw');
        expect(session.user).toHaveProperty('countryRole')
        expect(session.user?.countryRole).toBe('user');

        const response: AuthViewModel = JSON.parse(res._getData());
        expect(response).toHaveProperty('status');
        expect(response.status).toBe('success');
        expect(response).toHaveProperty('rucioIdentity');
        expect(response.rucioIdentity).toBe('/C=GB/O=Isode Limited/CN=Steve Kille');
        expect(response).toHaveProperty('rucioAccount');
        expect(response.rucioAccount).toBe('root');
        expect(response).toHaveProperty('rucioAuthType');
        expect(response.rucioAuthType).toBe('x509');
        expect(response).toHaveProperty('rucioAuthToken');
        expect(response.rucioAuthToken).toBe('rucio-/C=GB/O=Isode Limited/CN=Steve Kille-askdjljioj');
        expect(response).toHaveProperty('rucioAuthTokenExpires');
        expect(response.rucioAuthTokenExpires).toBe('2021-09-01T00:00:00.000Z');
        expect(response).toHaveProperty('role');
        expect(response.role).toBe(Role.ADMIN);
        expect(response).toHaveProperty('country');
        expect(response.country).toBe('tw');
        expect(response).toHaveProperty('countryRole');
        expect(response.countryRole).toBe('user');

    })

    it('should return 500 if session is not initialized due to invalid VO', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                rucioAccount: 'root',
                rucioAuthToken: 'rucio-ddmlab-askdjljioj',
                rucioTokenExpiry: '2021-09-01T00:00:00.000Z',
                shortVOName: 'ERROR_VO_WILL_NOT_BE_FOUND',
            }
        });
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })
        req.session = session
        const requestBody = req.body
        await setEmptySession(session, true)
        const setX509LoginSessionController = appContainer.get<ISetX509LoginSessionController>(CONTROLLERS.SET_X509_LOGIN_SESSION)
        await setX509LoginSessionController.handle(
            session, 
            res, 
            requestBody.rucioAuthToken, 
            requestBody.rucioAccount, 
            requestBody.shortVOName, 
            requestBody.rucioTokenExpiry
        )

        expect(res._getStatusCode()).toBe(500);
        expect(session.user).toHaveProperty('isLoggedIn');
        expect(session.user?.isLoggedIn).toBe(false);
        expect(session.user).toHaveProperty('rucioAuthToken');
        expect(session.user?.rucioAuthToken).toBe('');
        expect(session.user).toHaveProperty('rucioAuthTokenExpires');
        expect(session.user?.rucioAuthTokenExpires).toBe('');

        const response: AuthViewModel = JSON.parse(res._getData());
        expect(response).toHaveProperty('status');
        expect(response.status).toBe('error');
        expect(response).toHaveProperty('message');
        expect(response.message).toContain('ERROR_VO_WILL_NOT_BE_FOUND');
    
    })
})