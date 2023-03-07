import { setEmptySession } from "@/lib/infrastructure/auth/session-utils";
import appContainer from "@/lib/infrastructure/config/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/config/ioc/ioc-symbols-controllers";
import { ILoginConfigController } from "@/lib/infrastructure/controller/login-config-controller";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login";
import { getIronSession } from "iron-session";
import { createMocks } from "node-mocks-http";
import { createOIDCProviders, deleteOIDCProviders } from "test/fixtures/oidc-provider-config";

describe('Login Page Config API Test', () => {
    beforeEach(() => {
        createOIDCProviders()
    })
    afterEach(() => {
        fetchMock.resetMocks();
        deleteOIDCProviders()
    })

    it('should present successful LoginViewModel for singleVO', async () => {
        const { req, res } = createMocks({
            method: 'GET',
        });
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })
        await setEmptySession(session, true)

        const loginConfigController = appContainer.get<ILoginConfigController>(CONTROLLERS.LOGIN_CONFIG)
        await loginConfigController.getLoginViewModel(session, res);

        expect(res._getStatusCode()).toBe(200);
        const viewModel: LoginViewModel = JSON.parse(res._getData());
        
        expect(viewModel).toHaveProperty('status');
        expect(viewModel.status).toBe('success');
        expect(viewModel).toHaveProperty('isLoggedIn');
        expect(viewModel.isLoggedIn).toBe(false);
        expect(viewModel).toHaveProperty('x509Enabled');
        expect(viewModel.x509Enabled).toBe(true);
        expect(viewModel).toHaveProperty('oidcEnabled');
        expect(viewModel.oidcEnabled).toBe(true);
        expect(viewModel).toHaveProperty('oidcProviders');
        expect(viewModel.oidcProviders).toHaveLength(2);
        expect(viewModel.oidcProviders[0]).toHaveProperty('name');
        expect(viewModel.oidcProviders[0].name).toBe('cern');
        
        expect(viewModel).toHaveProperty('rucioAuthHost');
        expect(viewModel.rucioAuthHost).toBe('https://rucio-auth-host.com');

        expect(viewModel).toHaveProperty('multiVOEnabled');
        expect(viewModel.multiVOEnabled).toBe(false);
        expect(viewModel).toHaveProperty('voList');
        expect(viewModel.voList).toHaveLength(1);
        expect(viewModel.voList[0]).toHaveProperty('name');
        expect(viewModel.voList[0].name).toBe('default');
    })

    it('should present successful LoginViewModel for multiVO', async () => {
        const { req, res } = createMocks({
            method: 'POST',
        });
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })
        await setEmptySession(session, true)

        process.env['MULTIVO_ENABLED'] = 'true'
        process.env['VO_LIST'] = 'vo1,vo2'
        process.env['VO_VO1_NAME'] = 'vo1'
        process.env['VO_VO1_OIDC_ENABLED'] = 'true'
        process.env['VO_VO1_OIDC_PROVIDERS'] = 'cern'
        process.env['VO_VO2_NAME'] = 'vo2'


        const loginConfigController = appContainer.get<ILoginConfigController>(CONTROLLERS.LOGIN_CONFIG)
        await loginConfigController.getLoginViewModel(session, res);

        expect(res._getStatusCode()).toBe(200);
        const viewModel: LoginViewModel = JSON.parse(res._getData());

        expect(viewModel).toHaveProperty('status');
        expect(viewModel.status).toBe('success');

        expect(viewModel).toHaveProperty('isLoggedIn');
        expect(viewModel.isLoggedIn).toBe(false);

        expect(viewModel).toHaveProperty('multiVOEnabled');
        expect(viewModel.multiVOEnabled).toBe(true);

        expect(viewModel).toHaveProperty('voList');
        expect(viewModel.voList).toHaveLength(2);

        expect(viewModel.voList[0]).toHaveProperty('name');
        expect(viewModel.voList[0].name).toBe('vo1');

        expect(viewModel.voList[0]).toHaveProperty('oidcEnabled');
        expect(viewModel.voList[0].oidcEnabled).toBe(true);

        expect(viewModel.voList[0]).toHaveProperty('oidcProviders');
        expect(viewModel.voList[0].oidcProviders).toHaveLength(1);

        expect(viewModel.voList[0].oidcProviders[0]).toHaveProperty('name');
        expect(viewModel.voList[0].oidcProviders[0].name).toBe('cern');

    })

    it('should present LoginConfigError for invalid or missing config', async () => {
        const { req, res } = createMocks({
            method: 'POST',
        });
        
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })
        
        await setEmptySession(session, true)
        
        delete process.env['OIDC_PROVIDERS']
        
        const loginConfigController = appContainer.get<ILoginConfigController>(CONTROLLERS.LOGIN_CONFIG)
        await loginConfigController.getLoginViewModel(session, res);

        expect(res._getStatusCode()).toBe(500);
        const viewModel: LoginViewModel = JSON.parse(res._getData());

        expect(viewModel).toHaveProperty('status');
        expect(viewModel.status).toBe('error');

        expect(viewModel).toHaveProperty('message');
        expect(viewModel.message).toContain('OIDC_PROVIDERS');
    })
})