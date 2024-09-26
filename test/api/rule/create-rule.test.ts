import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';

import { NextApiResponse } from 'next';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from '../../fixtures/rucio-server';
import { BaseController } from '@/lib/sdk/controller';
import { CreateRuleControllerParameters } from '@/lib/infrastructure/controller/create-rule-controller';
import { CreateRuleRequest } from '@/lib/core/usecase-models/create-rule-usecase-models';
import { CreateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { AccountType, DIDType } from '@/lib/core/entity/rucio';

describe('Feature: CreateRule', () => {
    const account = 'test_account';
    const approvalUserScope = 'user.test_account';
    const approvalGroupScope = 'group.test_account';
    const approvalDIDName = 'user.test_account.r2d2_request.YYYY-MM-DD_HH-MM-SS';

    const commonControllerParameters = {
        copies: 1,
        rse_expression: 'rse_expression_value',
        account: account,
        // Days
        lifetime_days: 2,
        notify: true,
        comments: 'Test comment',
        asynchronous: false,
    };

    const ruleIds = ['817b3030097446a38b3b842bf528e112'];

    const getValidatedCreateRuleEndpoint = (gatewayParameters: any): MockEndpoint => ({
        url: `${MockRucioServerFactory.RUCIO_HOST}/rules/`,
        method: 'POST',
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ruleIds),
        },
        requestValidator: async req => {
            const bodyJson = await req.text();
            return bodyJson === JSON.stringify(gatewayParameters);
        },
    });

    const createRuleEndpoint: MockEndpoint = {
        url: `${MockRucioServerFactory.RUCIO_HOST}/rules/`,
        method: 'POST',
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ruleIds),
        },
    };

    const getAccountInfoEndpoint = (type: AccountType): MockEndpoint => ({
        url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/${account}`,
        method: 'GET',
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: null,
                suspended_at: null,
                deleted_at: null,
                updated_at: Date.now(),
                status: 'ACTIVE',
                account: account,
                account_type: type,
                created_at: Date.now(),
            }),
        },
    });

    const getDIDInfoEndpoint = (scope: string, name: string, type: DIDType): MockEndpoint => ({
        url: `${MockRucioServerFactory.RUCIO_HOST}/dids/${scope}/${name}/status`,
        method: 'GET',
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scope: scope,
                name: name,
                type: type.toUpperCase(),
                account: 'root',
                bytes: 10485760,
                length: 1,
                md5: '273586f5e521dda4be1ba0a9bd31b35a',
                adler32: '447957af',
            }),
        },
    });

    const getAddAttachDIDEndpoint = (scope: string): MockEndpoint => ({
        url: `${MockRucioServerFactory.RUCIO_HOST}/dids/${scope}/name`,
        includes: `/dids/${scope}`,
        method: 'POST',
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: 'Created',
        },
    });

    const getSetStatusDIDEndpoint = (scope: string, name: string): MockEndpoint => ({
        url: `${MockRucioServerFactory.RUCIO_HOST}/dids/${scope}/name/status`,
        includes: `/dids/${scope}`,
        method: 'PUT',
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scope: scope,
                name: name,
                open: false,
            }),
        },
        requestValidator: async req => {
            return req.url.includes('r2d2_request');
        },
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should correctly pass and transform parameters with no approval need and no sampling', async () => {
        const dids = [{ scope: 'scope1', name: 'name1' }];

        const gatewayParameters = {
            dids: dids,
            copies: commonControllerParameters.copies,
            rse_expression: commonControllerParameters.rse_expression,
            account: commonControllerParameters.account,
            grouping: 'ALL',
            // Seconds
            lifetime: 172800,
            notify: 'Y',
            comments: commonControllerParameters.comments,
            asynchronous: commonControllerParameters.asynchronous,
            ask_approval: false,
            activity: 'User Subscriptions',
        };

        MockRucioServerFactory.createMockRucioServer(true, [
            getValidatedCreateRuleEndpoint(gatewayParameters),
            getDIDInfoEndpoint('scope1', 'name1', DIDType.DATASET),
        ]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const createRuleController = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
        const createRuleControllerParams: CreateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            dids,
            ...commonControllerParameters,
            ask_approval: false,
            grouping: 'ALL',
        };

        await createRuleController.execute(createRuleControllerParams);

        const viewModel: CreateRuleViewModel = res._getJSONData();
        expect(viewModel.status).toEqual('success');
        expect(viewModel.rule_ids.length).toEqual(1);
    });

    it('On approval need, should try to address account gateway and fail', async () => {
        const dids = [
            { scope: 'scope1', name: 'name1' },
            { scope: 'scope2', name: 'name2' },
        ];

        MockRucioServerFactory.createMockRucioServer(true, [createRuleEndpoint]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const createRuleController = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
        const createRuleControllerParams: CreateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ...commonControllerParameters,
            dids,
            ask_approval: true,
            grouping: 'ALL',
        };

        await createRuleController.execute(createRuleControllerParams);

        const viewModel: CreateRuleViewModel = res._getJSONData();
        expect(viewModel.status).toEqual('error');
    });

    it('On approval need, should try to add request dataset and fail', async () => {
        const dids = [
            { scope: 'scope1', name: 'name1' },
            { scope: 'scope2', name: 'name2' },
        ];

        MockRucioServerFactory.createMockRucioServer(true, [
            createRuleEndpoint,
            getAccountInfoEndpoint(AccountType.USER),
            getDIDInfoEndpoint('scope1', 'name1', DIDType.FILE),
            getDIDInfoEndpoint('scope2', 'name2', DIDType.FILE),
        ]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const createRuleController = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
        const createRuleControllerParams: CreateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ...commonControllerParameters,
            dids,
            ask_approval: true,
            grouping: 'ALL',
        };

        await createRuleController.execute(createRuleControllerParams);

        const viewModel: CreateRuleViewModel = res._getJSONData();
        expect(viewModel.status).toEqual('error');
    });

    it('On approval need, should try to set status of the request dataset and fail', async () => {
        const dids = [
            { scope: 'scope1', name: 'name1' },
            { scope: 'scope2', name: 'name2' },
        ];

        MockRucioServerFactory.createMockRucioServer(true, [
            createRuleEndpoint,
            getAccountInfoEndpoint(AccountType.USER),
            getDIDInfoEndpoint('scope1', 'name1', DIDType.FILE),
            getDIDInfoEndpoint('scope2', 'name2', DIDType.FILE),
            getAddAttachDIDEndpoint(approvalUserScope),
        ]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const createRuleController = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
        const createRuleControllerParams: CreateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ...commonControllerParameters,
            dids,
            ask_approval: true,
            grouping: 'ALL',
        };

        await createRuleController.execute(createRuleControllerParams);

        const viewModel: CreateRuleViewModel = res._getJSONData();
        expect(viewModel.status).toEqual('error');
    });

    it('On approval need, should pass if all endpoints return a valid response, packing the files in a dataset', async () => {
        const dids = [
            { scope: 'scope1', name: 'name1' },
            { scope: 'scope2', name: 'name2' },
        ];

        // Should create one dataset to include all the files
        const validatedCreateRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/`,
            method: 'POST',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ruleIds),
            },
            requestValidator: async req => {
                const parameters = await req.json();
                return parameters.dids.length === 1 && parameters.dids[0].scope === approvalUserScope;
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [
            validatedCreateRuleEndpoint,
            getAccountInfoEndpoint(AccountType.USER),
            getDIDInfoEndpoint('scope1', 'name1', DIDType.FILE),
            getDIDInfoEndpoint('scope2', 'name2', DIDType.FILE),
            getAddAttachDIDEndpoint(approvalUserScope),
            getSetStatusDIDEndpoint(approvalUserScope, approvalDIDName),
        ]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const createRuleController = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
        const createRuleControllerParams: CreateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ...commonControllerParameters,
            dids,
            ask_approval: true,
            grouping: 'ALL',
        };

        await createRuleController.execute(createRuleControllerParams);

        const viewModel: CreateRuleViewModel = res._getJSONData();
        expect(viewModel.status).toEqual('success');
    });

    it('Should set asynchronous request if there is a DID with container type', async () => {
        const dids = [{ scope: 'scope1', name: 'name1' }];

        // Should create one dataset to include all the files
        const validatedCreateRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/`,
            method: 'POST',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ruleIds),
            },
            requestValidator: async req => {
                const parameters = await req.json();
                return parameters.asynchronous;
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [
            validatedCreateRuleEndpoint,
            getAccountInfoEndpoint(AccountType.USER),
            getDIDInfoEndpoint('scope1', 'name1', DIDType.CONTAINER),
        ]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const createRuleController = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
        const createRuleControllerParams: CreateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ...commonControllerParameters,
            dids,
            ask_approval: false,
            grouping: 'ALL',
        };

        await createRuleController.execute(createRuleControllerParams);

        const viewModel: CreateRuleViewModel = res._getJSONData();
        expect(viewModel.status).toEqual('success');
    });

    it('On approval need, should create a container with a request dataset if there is another dataset and set asynchronous mode', async () => {
        const dids = [
            { scope: 'scope', name: 'file1' },
            { scope: 'scope', name: 'file2' },
            { scope: 'scope', name: 'dataset' },
        ];

        // Should create one dataset to include all the files, and then a container to contain this dataset
        const validatedCreateRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/`,
            method: 'POST',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ruleIds),
            },
            requestValidator: async req => {
                const parameters = await req.json();
                if (parameters.dids.length !== 1 || parameters.dids[0].scope !== approvalUserScope) {
                    return false;
                }
                return parameters.asynchronous;
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [
            validatedCreateRuleEndpoint,
            getAccountInfoEndpoint(AccountType.USER),
            getDIDInfoEndpoint('scope', 'file1', DIDType.FILE),
            getDIDInfoEndpoint('scope', 'file2', DIDType.FILE),
            getDIDInfoEndpoint('scope', 'dataset', DIDType.DATASET),
            getAddAttachDIDEndpoint(approvalUserScope),
            getSetStatusDIDEndpoint(approvalUserScope, approvalDIDName),
        ]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const createRuleController = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
        const createRuleControllerParams: CreateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ...commonControllerParameters,
            dids,
            ask_approval: true,
            grouping: 'ALL',
        };

        await createRuleController.execute(createRuleControllerParams);

        const viewModel: CreateRuleViewModel = res._getJSONData();
        expect(viewModel.status).toEqual('success');
    });

    it('Should not support multiple containers with approval', async () => {
        const dids = [
            { scope: 'scope', name: 'container1' },
            { scope: 'scope', name: 'container2' },
        ];

        MockRucioServerFactory.createMockRucioServer(true, [
            createRuleEndpoint,
            getAccountInfoEndpoint(AccountType.USER),
            getDIDInfoEndpoint('scope', 'container1', DIDType.CONTAINER),
            getDIDInfoEndpoint('scope', 'container2', DIDType.CONTAINER),
            getAddAttachDIDEndpoint(approvalUserScope),
            getSetStatusDIDEndpoint(approvalUserScope, approvalDIDName),
        ]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const createRuleController = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
        const createRuleControllerParams: CreateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ...commonControllerParameters,
            dids,
            ask_approval: true,
            grouping: 'ALL',
        };

        await createRuleController.execute(createRuleControllerParams);

        const viewModel: CreateRuleViewModel = res._getJSONData();
        expect(viewModel.status).toEqual('error');
        expect(viewModel.message).toContain('Container');
    });
});
