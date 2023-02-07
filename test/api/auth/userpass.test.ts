import { createMocks } from 'node-mocks-http';
import { enableFetchMocks } from 'jest-fetch-mock'
import appContainer from '@/lib/infrastructure/config/ioc/container-config';
import { IUserPassLoginController } from '@/lib/infrastructure/controller/userpass-login-controller';
import CONTROLLERS from '@/lib/infrastructure/config/ioc/ioc-symbols-controllers';
import { NextApiResponse } from 'next';
import { LoginViewModel } from '@/lib/infrastructure/data/view-model/login';


describe('UserPassLogin API Test', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const authServer = process.env.RUCIO_AUTH_HOST;
        fetchMock.mockIf(/^https?:\/\/rucio-auth-host.com.*$/, (req) => {
            if (req.url.endsWith('/auth/userpass')) {
                return Promise.resolve({
                    status: 200,
                    body: JSON.stringify({
                        rucioIdentity: 'ddmlab'
                    })
                })
            }
        })
    })
    // enableFetchMocks();
    it('should present successful LoginViewModel', async () => {

        // fetch.mockResponseOnce(JSON.stringify({ rucioIdentity: 'ddmlab' }));
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'ddmlab',
                password: 'secret'
            }
        });
        const userpassLoginController = appContainer.get<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN)
        userpassLoginController.handle(req.body.username, req.body.password, 'ddmlab', res as undefined as NextApiResponse, '/dashboard');
        console.log(res._getStatusCode());
        expect(res._getStatusCode()).toBe(200);
        const viewModel: LoginViewModel = JSON.parse(res._getData());
        expect(viewModel).toHaveProperty('rucioIdentity');
        expect(viewModel.rucioIdentity).toBe('ddmlab');
    });

});