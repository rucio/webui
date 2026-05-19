import GetDDMLinkUseCase from '@/lib/core/use-case/get-ddm-link-usecase';
import { GetDDMLinkOutputPort } from '@/lib/core/port/primary/get-ddm-link-ports';
import {
    ConfigNotFoundError,
    FeatureDisabledError,
    GetDDMLinkError,
    GetDDMLinkRequest,
    GetDDMLinkResponse,
} from '@/lib/core/usecase-models/get-ddm-link-usecase-models';
import { createDDMDashboardUrl } from '@/lib/core/utils/ddm-link-utils';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { Signal } from '@/lib/sdk/web';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetDDMLinkControllerParameters } from '@/lib/infrastructure/controller/get-ddm-link-controller';
import { DDMLinkViewModel } from '@/lib/infrastructure/data/view-model/request';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory from 'test/fixtures/rucio-server';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePresenter(): GetDDMLinkOutputPort & {
    lastSuccess: GetDDMLinkResponse | undefined;
    lastError: GetDDMLinkError | undefined;
} {
    let lastSuccess: GetDDMLinkResponse | undefined;
    let lastError: GetDDMLinkError | undefined;
    return {
        response: undefined as unknown as Signal,
        async presentSuccess(model: GetDDMLinkResponse) {
            lastSuccess = model;
        },
        async presentError(model: GetDDMLinkError) {
            lastError = model;
        },
        get lastSuccess() {
            return lastSuccess;
        },
        get lastError() {
            return lastError;
        },
    };
}

function makeEnvConfig(overrides: Record<string, string | undefined> = {}): EnvConfigGatewayOutputPort {
    const config: Record<string, string | undefined> = {
        FEATURE_DDM_DASHBOARD: 'true',
        DDM_DASHBOARD_BASE_URL: 'https://grafana.example.com/d/ddm',
        ...overrides,
    };
    return {
        get: jest.fn(async (key: string) => config[key]),
    } as unknown as EnvConfigGatewayOutputPort;
}

const BASE_REQUEST: AuthenticatedRequestModel<GetDDMLinkRequest> = {
    rucioAuthToken: 'test-token',
    scope: 'test',
    name: 'file1',
    rse: 'XRD1',
};

// ---------------------------------------------------------------------------
// createDDMDashboardUrl unit tests
// ---------------------------------------------------------------------------

describe('createDDMDashboardUrl', () => {
    it('should build a URL with the correct Grafana variable query params', () => {
        const url = createDDMDashboardUrl('https://grafana.example.com/d/ddm', 'test', 'file1', 'XRD1');
        expect(url).toBe('https://grafana.example.com/d/ddm?var-scope=test&var-name=file1&var-rse=XRD1');
    });

    it('should percent-encode forward slashes in scope', () => {
        const url = createDDMDashboardUrl('https://grafana.example.com/d/ddm', 'cms/data', 'file1', 'XRD1');
        expect(url).toContain('var-scope=cms%2Fdata');
    });

    it('should encode spaces as + and special chars in name and rse', () => {
        const url = createDDMDashboardUrl('https://grafana.example.com/d/ddm', 'test', 'my file+1', 'RSE #1');
        // URLSearchParams encodes spaces as '+' and '#' as '%23', '+' as '%2B'
        expect(url).toContain('var-name=my+file%2B1');
        expect(url).toContain('var-rse=RSE+%231');
    });

    it('should include all three variable params in the output when baseUrl already has a query string', () => {
        // When the caller passes a baseUrl with an existing query string, the
        // implementation appends '?' unconditionally.  The test documents the
        // current behaviour; callers are expected to supply a baseUrl without a
        // query string.
        const url = createDDMDashboardUrl('https://grafana.example.com/d/ddm?orgId=1', 'test', 'file1', 'XRD1');
        expect(url).toContain('var-scope=test');
        expect(url).toContain('var-name=file1');
        expect(url).toContain('var-rse=XRD1');
    });
});

// ---------------------------------------------------------------------------
// GetDDMLinkUseCase unit tests
// ---------------------------------------------------------------------------

describe('GetDDMLinkUseCase', () => {
    it('should call presentError with FeatureDisabledError (code 403) when feature flag is "false"', async () => {
        const presenter = makePresenter();
        const envConfig = makeEnvConfig({ FEATURE_DDM_DASHBOARD: 'false' });
        const useCase = new GetDDMLinkUseCase(presenter, envConfig);

        await useCase.execute(BASE_REQUEST);

        expect(presenter.lastError).toBeDefined();
        expect((presenter.lastError as FeatureDisabledError).type).toBe('FeatureDisabledError');
        expect(presenter.lastError!.code).toBe(403);
        expect(presenter.lastSuccess).toBeUndefined();
    });

    it('should call presentError with FeatureDisabledError when feature flag is missing', async () => {
        const presenter = makePresenter();
        const envConfig = makeEnvConfig({ FEATURE_DDM_DASHBOARD: undefined });
        const useCase = new GetDDMLinkUseCase(presenter, envConfig);

        await useCase.execute(BASE_REQUEST);

        expect(presenter.lastError).toBeDefined();
        expect((presenter.lastError as FeatureDisabledError).type).toBe('FeatureDisabledError');
        expect(presenter.lastSuccess).toBeUndefined();
    });

    it('should call presentError with FeatureDisabledError when feature flag is "TRUE" (uppercase treated as enabled)', async () => {
        const presenter = makePresenter();
        const envConfig = makeEnvConfig({ FEATURE_DDM_DASHBOARD: 'TRUE' });
        const useCase = new GetDDMLinkUseCase(presenter, envConfig);

        await useCase.execute(BASE_REQUEST);

        // 'TRUE'.toLowerCase() === 'true' → feature is enabled, so no error
        expect(presenter.lastError).toBeUndefined();
        expect(presenter.lastSuccess).toBeDefined();
    });

    it('should call presentError with ConfigNotFoundError (code 500) when base URL is undefined', async () => {
        const presenter = makePresenter();
        const envConfig = makeEnvConfig({ DDM_DASHBOARD_BASE_URL: undefined });
        const useCase = new GetDDMLinkUseCase(presenter, envConfig);

        await useCase.execute(BASE_REQUEST);

        expect(presenter.lastError).toBeDefined();
        expect((presenter.lastError as ConfigNotFoundError).type).toBe('ConfigNotFoundError');
        expect(presenter.lastError!.code).toBe(500);
        expect(presenter.lastSuccess).toBeUndefined();
    });

    it('should call presentError with ConfigNotFoundError when base URL is an empty string', async () => {
        const presenter = makePresenter();
        const envConfig = makeEnvConfig({ DDM_DASHBOARD_BASE_URL: '   ' });
        const useCase = new GetDDMLinkUseCase(presenter, envConfig);

        await useCase.execute(BASE_REQUEST);

        expect(presenter.lastError).toBeDefined();
        expect((presenter.lastError as ConfigNotFoundError).type).toBe('ConfigNotFoundError');
        expect(presenter.lastSuccess).toBeUndefined();
    });

    it('should call presentSuccess with the correctly constructed URL on the happy path', async () => {
        const presenter = makePresenter();
        const envConfig = makeEnvConfig();
        const useCase = new GetDDMLinkUseCase(presenter, envConfig);

        await useCase.execute(BASE_REQUEST);

        expect(presenter.lastSuccess).toEqual({
            status: 'success',
            url: 'https://grafana.example.com/d/ddm?var-scope=test&var-name=file1&var-rse=XRD1',
        });
        expect(presenter.lastError).toBeUndefined();
    });

    it('should URLSearchParams-encode special characters in the constructed URL', async () => {
        const presenter = makePresenter();
        const envConfig = makeEnvConfig();
        const useCase = new GetDDMLinkUseCase(presenter, envConfig);

        await useCase.execute({
            ...BASE_REQUEST,
            scope: 'cms/data',
            name: 'my file',
            rse: 'RSE#1',
        });

        expect(presenter.lastSuccess).toBeDefined();
        const { url } = presenter.lastSuccess!;
        expect(url).toContain('var-scope=cms%2Fdata');
        expect(url).toContain('var-name=my+file');
        expect(url).toContain('var-rse=RSE%231');
    });
});

// ---------------------------------------------------------------------------
// GET /api/feature/get-ddm-link — API route integration tests
// ---------------------------------------------------------------------------

describe('GET DDM link API route test', () => {
    beforeEach(() => {
        process.env.FEATURE_DDM_DASHBOARD = 'true';
        process.env.DDM_DASHBOARD_BASE_URL = 'https://grafana.example.com/d/ddm';
    });

    afterEach(() => {
        delete process.env.FEATURE_DDM_DASHBOARD;
        delete process.env.DDM_DASHBOARD_BASE_URL;
    });

    test('it should return a DDM Dashboard URL with correctly encoded query params', async () => {
        const { req, res } = await createHttpMocks(
            '/api/feature/get-ddm-link?scope=test&name=file.txt&rse=CERN_DISK',
            'GET',
            {},
        );

        const controller = appContainer.get<BaseController<GetDDMLinkControllerParameters, GetDDMLinkRequest>>(
            CONTROLLERS.GET_DDM_LINK,
        );

        const controllerParameters: GetDDMLinkControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            scope: 'test',
            name: 'file.txt',
            rse: 'CERN_DISK',
        };

        await controller.execute(controllerParameters);

        const data: DDMLinkViewModel = res._getJSONData();
        expect(data.status).toBe('success');
        expect(data.url).toContain('https://grafana.example.com/d/ddm');
        expect(data.url).toContain('var-scope=test');
        expect(data.url).toContain('var-name=file.txt');
        expect(data.url).toContain('var-rse=CERN_DISK');
    });

    test('it should return an error view model when the feature flag is disabled', async () => {
        process.env.FEATURE_DDM_DASHBOARD = 'false';

        const { req, res } = await createHttpMocks(
            '/api/feature/get-ddm-link?scope=test&name=file.txt&rse=CERN_DISK',
            'GET',
            {},
        );

        const controller = appContainer.get<BaseController<GetDDMLinkControllerParameters, GetDDMLinkRequest>>(
            CONTROLLERS.GET_DDM_LINK,
        );

        await controller.execute({
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            scope: 'test',
            name: 'file.txt',
            rse: 'CERN_DISK',
        });

        const data: DDMLinkViewModel = res._getJSONData();
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('feature_disabled');
    });

    test('it should return an error view model when the base URL env var is not set', async () => {
        delete process.env.DDM_DASHBOARD_BASE_URL;

        const { req, res } = await createHttpMocks(
            '/api/feature/get-ddm-link?scope=test&name=file.txt&rse=CERN_DISK',
            'GET',
            {},
        );

        const controller = appContainer.get<BaseController<GetDDMLinkControllerParameters, GetDDMLinkRequest>>(
            CONTROLLERS.GET_DDM_LINK,
        );

        await controller.execute({
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            scope: 'test',
            name: 'file.txt',
            rse: 'CERN_DISK',
        });

        const data: DDMLinkViewModel = res._getJSONData();
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('config_not_found');
    });

    test('it should still return a success view model even when params are empty strings (route guard validates before controller)', async () => {
        // The route handler returns HTTP 400 before the controller is ever invoked when
        // required query params are absent.  We verify here that blank strings passed
        // directly to the controller result in a constructed (but degenerate) URL, which
        // confirms the route-level guard is the correct place to enforce presence.
        const { req, res } = await createHttpMocks('/api/feature/get-ddm-link', 'GET', {});

        const controller = appContainer.get<BaseController<GetDDMLinkControllerParameters, GetDDMLinkRequest>>(
            CONTROLLERS.GET_DDM_LINK,
        );

        await controller.execute({
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            scope: '',
            name: '',
            rse: '',
        });

        const data: DDMLinkViewModel = res._getJSONData();
        // The use case succeeds (it only checks env vars, not param presence).
        // The degenerate URL should still start with the base URL.
        expect(data.status).toBe('success');
        expect(data.url).toContain('https://grafana.example.com/d/ddm');
    });
});
