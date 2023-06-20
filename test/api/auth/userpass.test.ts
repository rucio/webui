import { createMocks } from 'node-mocks-http';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { IUserPassLoginController } from '@/lib/infrastructure/controller/userpass-login-controller';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { NextApiResponse } from 'next';
import { AuthViewModel } from '@/lib/infrastructure/data/auth/auth';
import { getIronSession } from 'iron-session';
import { setEmptySession } from '@/lib/infrastructure/auth/session-utils';
import { Role } from '@/lib/core/entity/auth-models';


describe('UserPassLogin API Test', () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockIf(/^https?:\/\/rucio-.*.com.*$/, (req) => {
            if (req.url.endsWith('/auth/userpass')) {
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Rucio-Auth-Token': 'rucio-ddmlab-askdjljioj',
                        'X-Rucio-Auth-Account': 'root',
                        'X-Rucio-Auth-Token-Expires': '2021-09-01T00:00:00.000Z'
                    },
                    body: JSON.stringify({
                    })
                })
            }
            if(req.url.endsWith('/accounts/root/attr')){
                const rucioToken = req.headers.get('X-Rucio-Auth-Token')
                if(rucioToken !== 'rucio-ddmlab-askdjljioj') {
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
    
    it('should present successful LoginViewModel', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'ddmlab',
                password: 'secret',
            }
        });
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })
        
        await setEmptySession(session, true)

        const userpassLoginController = appContainer.get<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN)
        await userpassLoginController.handle(req.body.username, req.body.password, 'root', 'def', session, res as undefined as NextApiResponse, '/dashboard');
        expect(res._getStatusCode()).toBe(200);
        const viewModel: AuthViewModel = JSON.parse(res._getData());
        expect(viewModel).toHaveProperty('rucioIdentity');
        expect(viewModel.rucioIdentity).toBe('ddmlab');
        expect(viewModel).toHaveProperty('rucioAuthToken');
        expect(viewModel.rucioAuthToken).toBe('rucio-ddmlab-askdjljioj');
        expect(viewModel).toHaveProperty('rucioAccount');
        expect(viewModel.rucioAccount).toBe('root');
        expect(viewModel).toHaveProperty('rucioAuthTokenExpires');
        expect(viewModel.rucioAuthTokenExpires).toBe('2021-09-01T00:00:00.000Z');
        expect(viewModel).toHaveProperty('role')
        expect(viewModel.role).toBe(Role.ADMIN)
        expect(viewModel).toHaveProperty('country')
        expect(viewModel.country).toBe('tw')
        expect(viewModel).toHaveProperty('countryRole')
        expect(viewModel.countryRole).toBe('user')

        expect(session.user).toHaveProperty('rucioIdentity');
        expect(session.user?.rucioIdentity).toBe('ddmlab');
        expect(session.user).toHaveProperty('rucioAuthToken');
        expect(session.user?.rucioAuthToken).toBe('rucio-ddmlab-askdjljioj');
        expect(session.user).toHaveProperty('rucioAccount');
        expect(session.user?.rucioAccount).toBe('root');
        expect(session.user).toHaveProperty('isLoggedIn');
        expect(session.user?.isLoggedIn).toBe(true);
        expect(session.user).toHaveProperty('rucioAuthTokenExpires');
        expect(session.user?.rucioAuthTokenExpires).toBe('2021-09-01T00:00:00.000Z');
        expect(session.user).toHaveProperty('role')
        expect(session.user?.role).toBe(Role.ADMIN)
        expect(session.user).toHaveProperty('country')
        expect(session.user?.country).toBe('tw')
        expect(session.user).toHaveProperty('countryRole')
        expect(session.user?.countryRole).toBe('user')
    });

});