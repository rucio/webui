import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { UpdateRuleRequest } from '@/lib/core/usecase-models/update-rule-usecase-models';
import { UpdateRuleControllerParameters } from '@/lib/infrastructure/controller/update-rule-controller';
import { UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

const RULE_ID = 'fdc8ae7f04894bf5bf328bf610e21315';

describe('Feature: UpdateRule', () => {
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should return 200 with status success when updating priority', async () => {
        fetchMock.doMock();
        const updateRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/${RULE_ID}`,
            method: 'PUT',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: '',
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [updateRuleEndpoint]);

        const { res } = await createHttpMocks('/api/feature/update-rule', 'PUT', {});

        const controller = appContainer.get<BaseController<UpdateRuleControllerParameters, UpdateRuleRequest>>(CONTROLLERS.UPDATE_RULE);
        const controllerParams: UpdateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ruleId: RULE_ID,
            options: { priority: 5 },
        };
        await controller.execute(controllerParams);

        expect(res._getStatusCode()).toBe(200);
        const data: UpdateRuleViewModel = JSON.parse(res._getData());
        expect(data.status).toBe('success');
        expect(data.message).toBe('Rule updated successfully');
    });

    it('should return errorType unauthorized on 401 from gateway', async () => {
        fetchMock.doMock();
        const updateRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/${RULE_ID}`,
            method: 'PUT',
            response: {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ExceptionMessage: 'Auth token expired' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(false, [updateRuleEndpoint]);

        const { res } = await createHttpMocks('/api/feature/update-rule', 'PUT', {});

        const controller = appContainer.get<BaseController<UpdateRuleControllerParameters, UpdateRuleRequest>>(CONTROLLERS.UPDATE_RULE);
        const controllerParams: UpdateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ruleId: RULE_ID,
            options: { priority: 5 },
        };
        await controller.execute(controllerParams);

        const data: UpdateRuleViewModel = JSON.parse(res._getData());
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('unauthorized');
    });

    it('should return errorType permission_denied on 403 from gateway', async () => {
        fetchMock.doMock();
        const updateRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/${RULE_ID}`,
            method: 'PUT',
            response: {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ExceptionMessage: 'Access denied' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(false, [updateRuleEndpoint]);

        const { res } = await createHttpMocks('/api/feature/update-rule', 'PUT', {});

        const controller = appContainer.get<BaseController<UpdateRuleControllerParameters, UpdateRuleRequest>>(CONTROLLERS.UPDATE_RULE);
        const controllerParams: UpdateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ruleId: RULE_ID,
            options: { priority: 5 },
        };
        await controller.execute(controllerParams);

        const data: UpdateRuleViewModel = JSON.parse(res._getData());
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('permission_denied');
    });

    it('should return errorType not_found on 404 from gateway', async () => {
        fetchMock.doMock();
        const updateRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/${RULE_ID}`,
            method: 'PUT',
            response: {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ExceptionMessage: 'Rule not found' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(false, [updateRuleEndpoint]);

        const { res } = await createHttpMocks('/api/feature/update-rule', 'PUT', {});

        const controller = appContainer.get<BaseController<UpdateRuleControllerParameters, UpdateRuleRequest>>(CONTROLLERS.UPDATE_RULE);
        const controllerParams: UpdateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ruleId: RULE_ID,
            options: { priority: 5 },
        };
        await controller.execute(controllerParams);

        const data: UpdateRuleViewModel = JSON.parse(res._getData());
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('not_found');
    });

    it('should return errorType conflict on 409 from gateway', async () => {
        fetchMock.doMock();
        const updateRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/${RULE_ID}`,
            method: 'PUT',
            response: {
                status: 409,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ExceptionMessage: 'Rule state prevents update' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(false, [updateRuleEndpoint]);

        const { res } = await createHttpMocks('/api/feature/update-rule', 'PUT', {});

        const controller = appContainer.get<BaseController<UpdateRuleControllerParameters, UpdateRuleRequest>>(CONTROLLERS.UPDATE_RULE);
        const controllerParams: UpdateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ruleId: RULE_ID,
            options: { priority: 5 },
        };
        await controller.execute(controllerParams);

        const data: UpdateRuleViewModel = JSON.parse(res._getData());
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('conflict');
    });

    it('should return errorType unknown on 500 from gateway', async () => {
        fetchMock.doMock();
        const updateRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/${RULE_ID}`,
            method: 'PUT',
            response: {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ExceptionMessage: 'Internal server error' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(false, [updateRuleEndpoint]);

        const { res } = await createHttpMocks('/api/feature/update-rule', 'PUT', {});

        const controller = appContainer.get<BaseController<UpdateRuleControllerParameters, UpdateRuleRequest>>(CONTROLLERS.UPDATE_RULE);
        const controllerParams: UpdateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ruleId: RULE_ID,
            options: { priority: 5 },
        };
        await controller.execute(controllerParams);

        const data: UpdateRuleViewModel = JSON.parse(res._getData());
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('unknown');
    });
});
