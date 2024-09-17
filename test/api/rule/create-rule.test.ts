import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';

import { NextApiResponse } from 'next';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from '../../fixtures/rucio-server';
import { BaseController } from '@/lib/sdk/controller';
import { CreateRuleControllerParameters } from '@/lib/infrastructure/controller/create-rule-controller';
import { CreateRuleRequest } from '@/lib/core/usecase-models/create-rule-usecase-models';
import { collectStreamedData } from '@/lib/sdk/utils';
import { CreateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

describe('Feature: CreateRule', () => {
    const controllerCreationParameters = {
        dids: [{ scope: 'scope1', name: 'name1' }],
        copies: 1,
        rse_expression: 'rse_expression_value',
        account: 'account_value',
        // Days
        lifetime_days: 2,
        notify: true,
        comments: 'Test comment',
        ask_approval: true,
        asynchronous: false,
    };

    const gatewayCreationParameters = {
        dids: controllerCreationParameters.dids,
        copies: controllerCreationParameters.copies,
        rse_expression: controllerCreationParameters.rse_expression,
        account: controllerCreationParameters.account,
        grouping: 'ALL',
        // Seconds
        lifetime: 172800,
        notify: 'Y',
        comments: controllerCreationParameters.comments,
        asynchronous: controllerCreationParameters.asynchronous,
        ask_approval: controllerCreationParameters.ask_approval,
    };

    const ruleIds = ['817b3030097446a38b3b842bf528e112'];

    beforeEach(() => {
        fetchMock.doMock();
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
            requestValidator: async req => {
                const bodyJson = await req.text();
                return bodyJson === JSON.stringify(gatewayCreationParameters);
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [createRuleEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should correctly transform parameters and receive a valid response', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        res.write = chunk => {
            const response: CreateRuleViewModel = JSON.parse(chunk);
            expect(response?.status).toEqual('success');
            expect(response?.rule_ids.length).toEqual(1);
            return true;
        };

        const createRuleController = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
        const createRuleControllerParams: CreateRuleControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            ...controllerCreationParameters,
            grouping: 'ALL',
        };

        await createRuleController.execute(createRuleControllerParams);
    });
});
