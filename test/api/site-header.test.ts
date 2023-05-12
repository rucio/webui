import { SessionUser } from "@/lib/core/entity/auth-models";
import { addOrUpdateSessionUser, setEmptySession } from "@/lib/infrastructure/auth/session-utils";
import appContainer from "@/lib/infrastructure/config/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/config/ioc/ioc-symbols-controllers";
import { ISiteHeaderController } from "@/lib/infrastructure/controller/site-header-controller";
import { SiteHeaderViewModel } from "@/lib/infrastructure/data/view-model/site-header";
import { getIronSession } from "iron-session";
import { NextApiRequest } from "next";
import { createMocks } from "node-mocks-http";

describe('SiteHeader API Test', () => {
    it('should present successful SiteHeaderViewModel', async () => {
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

        process.env['PROJECT_URL'] = 'https://atlas.cern'
        
        await setEmptySession(session, true)
        await addOrUpdateSessionUser(session, {
            rucioIdentity: 'ddmlab',
            rucioAccount: 'root',
            rucioAuthToken: 'rucio-ddmlab-askdjljioj',
            rucioAuthTokenExpires: '2021-09-01T00:00:00.000Z',
            rucioAuthType: 'userpass',
            rucioOIDCProvider: '',
            rucioVO: 'def',
        } as SessionUser)

        const siteHeaderController = appContainer.get<ISiteHeaderController>(CONTROLLERS.SITE_HEADER)
        await siteHeaderController.handle(session, res as undefined as NextApiRequest);

        expect(res._getStatusCode()).toBe(200);
        const viewModel: SiteHeaderViewModel = JSON.parse(res._getData());
        expect(viewModel).toHaveProperty('projectUrl');
        expect(viewModel.projectUrl).toBe('https://atlas.cern');
        expect(viewModel).toHaveProperty('activeAccount');
        expect(viewModel.activeAccount?.rucioIdentity).toBe('ddmlab');
        expect(viewModel.homeUrl).toBe('/dashboard')
    })

})