import { SessionUser } from '@/lib/core/entity/auth-models';
import { addOrUpdateSessionUser, setEmptySession } from '@/lib/infrastructure/auth/session-utils';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import GetSiteHeaderController from '@/lib/infrastructure/controller/get-site-header-controller';
import { GetSiteHeaderControllerParameters } from '@/lib/infrastructure/controller/get-site-header-controller';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { createHttpMocks, createMockSession } from 'test/fixtures/http-fixtures';

describe('Get SiteHeader API Test', () => {
    it('should present successful SiteHeaderViewModel', async () => {
        const { req, res } = createMocks({
            url: 'http://testhost:3000/api/site-header',
        });
        const session = createMockSession();

        process.env['PROJECT_URL'] = 'https://atlas.cern';

        await setEmptySession(session, true);
        await addOrUpdateSessionUser(session, {
            rucioIdentity: 'ddmlab',
            rucioAccount: 'root',
            rucioAuthToken: 'rucio-ddmlab-askdjljioj',
            rucioAuthTokenExpires: '2021-09-01T00:00:00.000Z',
            rucioAuthType: 'userpass',
            rucioOIDCProvider: '',
            rucioVO: 'def',
        } as SessionUser);

        const getSiteHeaderController = appContainer.get<GetSiteHeaderController>(CONTROLLERS.GET_SITE_HEADER);
        const getSiteHeaderControllerParameters = {
            session: session,
            response: res as unknown as NextApiResponse,
        };
        await getSiteHeaderController.execute(getSiteHeaderControllerParameters);

        expect(res._getStatusCode()).toBe(200);
        const viewModel: SiteHeaderViewModel = JSON.parse(res._getData());
        expect(viewModel).toHaveProperty('projectUrl');
        expect(viewModel.projectUrl).toBe('https://atlas.cern');
        expect(viewModel).toHaveProperty('activeAccount');
        expect(viewModel.activeAccount?.rucioIdentity).toBe('ddmlab');
        expect(viewModel.homeUrl).toBe('/dashboard');

        delete process.env['PROJECT_URL'];
    });

    it('propagates rucioAuthType for active and available accounts (#628 dropdown labels)', async () => {
        const { res, session } = await createHttpMocks();
        process.env['PROJECT_URL'] = 'https://atlas.cern';

        // Two live sessions with distinct auth types — the dropdown needs both
        // surfaced so each entry can render "via x509" / "via userpass".
        await addOrUpdateSessionUser(session, {
            rucioIdentity: '/C=CH/O=CERN/CN=Some Cert',
            rucioAccount: 'root',
            rucioAuthToken: 'rucio-cert-token',
            rucioAuthTokenExpires: '2030-01-01T00:00:00Z',
            rucioAuthType: 'x509',
            rucioOIDCProvider: '',
            rucioVO: 'def',
        } as SessionUser);
        await addOrUpdateSessionUser(session, {
            rucioIdentity: 'jdoe',
            rucioAccount: 'jdoe',
            rucioAuthToken: 'rucio-userpass-token',
            rucioAuthTokenExpires: '2030-01-01T00:00:00Z',
            rucioAuthType: 'userpass',
            rucioOIDCProvider: '',
            rucioVO: 'def',
        } as SessionUser);

        const controller = appContainer.get<GetSiteHeaderController>(CONTROLLERS.GET_SITE_HEADER);
        await controller.execute({
            session,
            response: res as unknown as NextApiResponse,
        });

        expect(res._getStatusCode()).toBe(200);
        const vm: SiteHeaderViewModel = JSON.parse(res._getData());

        // Active account is the most-recently-added user (jdoe via userpass).
        expect(vm.activeAccount?.rucioAccount).toBe('jdoe');
        expect(vm.activeAccount?.rucioAuthType).toBe('userpass');

        // availableAccounts must carry rucioAuthType per entry so the dropdown
        // can render "via X" labels and use auth-type-prefixed React keys.
        const root = vm.availableAccounts?.find(u => u.rucioAccount === 'root');
        const jdoe = vm.availableAccounts?.find(u => u.rucioAccount === 'jdoe');
        expect(root?.rucioAuthType).toBe('x509');
        expect(jdoe?.rucioAuthType).toBe('userpass');

        delete process.env['PROJECT_URL'];
    });

    it('should present SiteHeaderViewModel when Session does not contain any users', async () => {
        const { req, res, session } = await createHttpMocks();
        const siteHeaderController = appContainer.get<GetSiteHeaderController>(CONTROLLERS.GET_SITE_HEADER);
        await siteHeaderController.execute({
            session: session,
            response: res as unknown as NextApiResponse,
        });

        expect(res._getStatusCode()).toBe(418);
        const data = JSON.parse(res._getData());
        expect(data.message).toBe('no-active-user');
        expect(data).not.toHaveProperty('projectUrl');
        expect(data).not.toHaveProperty('activeAccount');
        expect(data).toHaveProperty('homeUrl');
        expect(data.homeUrl).toBe('/dashboard');

        expect(session.user).toBeUndefined();
        expect(session.allUsers).toHaveLength(0);
    });
});
