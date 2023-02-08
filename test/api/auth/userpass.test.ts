import { createMocks } from 'node-mocks-http';
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
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Rucio-Auth-Token': 'rucio-ddmlab-askdjljioj',
                        'X-Rucio-Auth-Account': 'root'
                    },
                    body: JSON.stringify({
                    })
                    
                })
            }
        })
    })
    it('should present successful LoginViewModel', async () => {

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'ddmlab',
                password: 'secret'
            }
        });
        const userpassLoginController = appContainer.get<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN)
        await userpassLoginController.handle(req.body.username, req.body.password, '', res as undefined as NextApiResponse, '/dashboard');
        expect(res._getStatusCode()).toBe(200);
        console.log(JSON.parse(res._getData()))
        const viewModel: LoginViewModel = JSON.parse(res._getData());
        expect(viewModel).toHaveProperty('rucioIdentity');
        expect(viewModel.rucioIdentity).toBe('ddmlab');
        expect(viewModel).toHaveProperty('rucioAuthToken');
        expect(viewModel.rucioAuthToken).toBe('rucio-ddmlab-askdjljioj');
        expect(viewModel).toHaveProperty('rucioAccount');
        expect(viewModel.rucioAccount).toBe('root');
    });

});