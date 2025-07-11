import appContainer from '@/lib/infrastructure/ioc/container-config';
import { ListRulesRequest } from '@/lib/core/usecase-models/list-rules-usecase-models';
import { ListRulesControllerParameters } from '@/lib/infrastructure/controller/list-rules-controller';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';

import { NextApiResponse } from 'next';
import { MockHttpStreamableResponseFactory } from '../../fixtures/http-fixtures';
import { Readable } from 'stream';
import MockRucioServerFactory, { MockEndpoint } from '../../fixtures/rucio-server';
import { BaseController } from '@/lib/sdk/controller';
import { collectStreamedData } from '../../fixtures/stream-test-utils';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { RuleState } from '@/lib/core/entity/rucio';

const mockRule = {
    subscription_id: null,
    rse_expression: 'MOCK|MOCK2|MOCK3',
    source_replica_expression: null,
    ignore_account_limit: false,
    created_at: 'Thu, 15 Aug 2024 10:59:39 UTC',
    account: 'root',
    copies: 2,
    activity: 'User Subscriptions',
    priority: 3,
    updated_at: 'Thu, 15 Aug 2024 10:59:39 UTC',
    scope: 'test',
    expires_at: null,
    grouping: 'DATASET',
    name: 'file1',
    weight: null,
    notification: 'NO',
    comments: null,
    did_type: 'FILE',
    locked: false,
    stuck_at: null,
    child_rule_id: null,
    state: 'REPLICATING',
    locks_ok_cnt: 0,
    purge_replicas: false,
    eol_at: null,
    id: '5ec54948fb0f4e80b57732b1ba92572c',
    error: null,
    locks_replicating_cnt: 2,
    ignore_availability: false,
    split_container: false,
    locks_stuck_cnt: 0,
    meta: null,
    bytes: 10485760,
};

const testRuleState = async (ruleState: RuleState, stateFilter: string) => {
    const listRulesMockEndpoint: MockEndpoint = {
        url: `${MockRucioServerFactory.RUCIO_HOST}/rules`,
        method: 'GET',
        includes: 'rules',
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: Readable.from([JSON.stringify(mockRule), JSON.stringify(mockRule)].join('\n')),
        },
        requestValidator: async request => {
            if (!request.url.includes(`state=${stateFilter}`)) {
                return false;
            }
            return true;
        },
    };
    MockRucioServerFactory.createMockRucioServer(true, [listRulesMockEndpoint]);

    const res = MockHttpStreamableResponseFactory.getMockResponse();

    const listRulesController = appContainer.get<BaseController<ListRulesControllerParameters, ListRulesRequest>>(CONTROLLERS.LIST_RULES);
    const listRulesControllerParams: ListRulesControllerParameters = {
        rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
        response: res as unknown as NextApiResponse,
        filters: {
            state: ruleState,
        },
    };

    await listRulesController.execute(listRulesControllerParams);

    expect(res.statusCode).toEqual(200);

    const receivedData = await collectStreamedData<string>(res);
    const parsedData = receivedData.map(data => JSON.parse(data)) as RuleViewModel[];

    expect(parsedData.length).toEqual(2);
    expect(parsedData[0].status).toEqual('success');
};

describe('Feature: ListRules', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should return a view model for a valid request to ListRules feature', async () => {
        const listRulesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules`,
            method: 'GET',
            includes: 'rules',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: Readable.from([JSON.stringify(mockRule), JSON.stringify(mockRule)].join('\n')),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [listRulesMockEndpoint]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const listRulesController = appContainer.get<BaseController<ListRulesControllerParameters, ListRulesRequest>>(CONTROLLERS.LIST_RULES);
        const listRulesControllerParams: ListRulesControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        };

        await listRulesController.execute(listRulesControllerParams);

        const receivedData = await collectStreamedData<string>(res);
        const parsedData = receivedData.map(data => JSON.parse(data)) as RuleViewModel[];

        expect(parsedData.length).toEqual(2);
        expect(parsedData[0].status).toEqual('success');
        expect(parsedData[0].name).toEqual('file1');
        expect(parsedData[1].account).toEqual('root');
    });

    it('should include all filters in the gateway request', async () => {
        const listRulesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules`,
            method: 'GET',
            includes: 'rules',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: Readable.from([JSON.stringify(mockRule), JSON.stringify(mockRule)].join('\n')),
            },
            requestValidator: async request => {
                if (!request.url.includes('account=root')) {
                    return false;
                }
                if (!request.url.includes('scope=test')) {
                    return false;
                }
                if (!request.url.includes('activity=User+Subscriptions')) {
                    return false;
                }
                if (!request.url.includes('name=file1')) {
                    return false;
                }
                if (!request.url.includes('updated_after=Thu%2C+15+Aug+2024+10%3A59%3A39+UTC')) {
                    return false;
                }
                if (!request.url.includes('updated_before=Fri%2C+16+Aug+2024+10%3A59%3A39+UTC')) {
                    return false;
                }
                return true;
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [listRulesMockEndpoint]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const listRulesController = appContainer.get<BaseController<ListRulesControllerParameters, ListRulesRequest>>(CONTROLLERS.LIST_RULES);
        const listRulesControllerParams: ListRulesControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            filters: {
                account: 'root',
                scope: 'test',
                activity: 'User Subscriptions',
                name: 'file1',
                updated_after: new Date('2024-08-15T10:59:39Z'),
                updated_before: new Date('2024-08-16T10:59:39Z'),
            },
        };

        await listRulesController.execute(listRulesControllerParams);

        expect(res.statusCode).toEqual(200);

        const receivedData = await collectStreamedData<string>(res);
        const parsedData = receivedData.map(data => JSON.parse(data)) as RuleViewModel[];

        expect(parsedData.length).toEqual(2);
        expect(parsedData[0].status).toEqual('success');
    });

    it('should transform REPLICATING RuleState to Rucio API filter', async () => {
        await testRuleState(RuleState.REPLICATING, 'R');
    });

    it('should transform OK RuleState to Rucio API filter', async () => {
        await testRuleState(RuleState.OK, 'O');
    });

    it('should transform STUCK RuleState to Rucio API filter', async () => {
        await testRuleState(RuleState.STUCK, 'S');
    });

    it('should transform SUSPENDED RuleState to Rucio API filter', async () => {
        await testRuleState(RuleState.SUSPENDED, 'U');
    });

    it('should transform WAITING_APPROVAL RuleState to Rucio API filter', async () => {
        await testRuleState(RuleState.WAITING_APPROVAL, 'W');
    });

    it('should transform INJECT RuleState to Rucio API filter', async () => {
        await testRuleState(RuleState.INJECT, 'I');
    });
});
