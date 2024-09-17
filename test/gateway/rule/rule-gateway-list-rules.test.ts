import { RuleDTO } from '@/lib/core/dto/rule-dto';
import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { Readable } from 'stream';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { collectStreamedData } from 'test/fixtures/stream-test-utils';

describe('RuleGateway', () => {
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should fetch a list of rules', async () => {
        fetchMock.doMock();
        const mockRuleStream = Readable.from(
            [
                JSON.stringify({
                    error: null,
                    locks_stuck_cnt: 0,
                    ignore_availability: false,
                    meta: null,
                    subscription_id: null,
                    rse_expression: 'XRD1',
                    source_replica_expression: null,
                    ignore_account_limit: false,
                    created_at: 'Mon, 27 Nov 2023 17:55:34 UTC',
                    account: 'root',
                    copies: 1,
                    activity: 'User Subscriptions',
                    priority: 3,
                    updated_at: 'Mon, 27 Nov 2023 17:56:00 UTC',
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
                    state: 'OK',
                    locks_ok_cnt: 1,
                    purge_replicas: false,
                    eol_at: null,
                    id: 'e456aa5c7ae04c1cbd6c1bf9c9e6621d',
                    locks_replicating_cnt: 0,
                    split_container: false,
                    bytes: 10485760,
                }),
                JSON.stringify({
                    error: null,
                    locks_stuck_cnt: 0,
                    ignore_availability: false,
                    meta: null,
                    subscription_id: null,
                    rse_expression: 'XRD1',
                    source_replica_expression: null,
                    ignore_account_limit: false,
                    created_at: 'Mon, 27 Nov 2023 17:56:03 UTC',
                    account: 'root',
                    copies: 1,
                    activity: 'User Subscriptions',
                    priority: 3,
                    updated_at: 'Mon, 27 Nov 2023 17:56:29 UTC',
                    scope: 'test',
                    expires_at: null,
                    grouping: 'DATASET',
                    name: 'file2',
                    weight: null,
                    notification: 'NO',
                    comments: null,
                    did_type: 'FILE',
                    locked: false,
                    stuck_at: null,
                    child_rule_id: null,
                    state: 'OK',
                    locks_ok_cnt: 1,
                    purge_replicas: false,
                    eol_at: null,
                    id: 'f6339c0ab1814ee289ecfdb5e8011909',
                    locks_replicating_cnt: 0,
                    split_container: false,
                    bytes: 10485760,
                }),
                JSON.stringify({
                    error: null,
                    locks_stuck_cnt: 0,
                    ignore_availability: false,
                    meta: null,
                    subscription_id: null,
                    rse_expression: 'XRD2',
                    source_replica_expression: null,
                    ignore_account_limit: false,
                    created_at: 'Mon, 27 Nov 2023 17:56:32 UTC',
                    account: 'root',
                    copies: 1,
                    activity: 'User Subscriptions',
                    priority: 3,
                    updated_at: 'Mon, 27 Nov 2023 17:56:58 UTC',
                    scope: 'test',
                    expires_at: null,
                    grouping: 'DATASET',
                    name: 'file3',
                    weight: null,
                    notification: 'NO',
                    comments: null,
                    did_type: 'FILE',
                    locked: false,
                    stuck_at: null,
                    child_rule_id: null,
                    state: 'OK',
                    locks_ok_cnt: 1,
                    purge_replicas: false,
                    eol_at: null,
                    id: '5242276fa0314af495d57c13a1a1a990',
                    locks_replicating_cnt: 0,
                    split_container: false,
                    bytes: 10485760,
                }),
            ].join('\n'),
        );

        const listRulesEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules`,
            method: 'GET',
            includes: 'rules',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: mockRuleStream,
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listRulesEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const listRulesDTO = await ruleGateway.listRules(MockRucioServerFactory.VALID_RUCIO_TOKEN);
        expect(listRulesDTO.status).toEqual('success');

        const ruleStream = listRulesDTO.stream;
        if (ruleStream == null || ruleStream == undefined) {
            fail('Rule stream is null or undefined');
        }

        const recievedData = await collectStreamedData<RuleDTO>(ruleStream);
        expect(recievedData.length).toEqual(3);
        expect(recievedData[0].id).toEqual('e456aa5c7ae04c1cbd6c1bf9c9e6621d');
        expect(recievedData[0].name).toEqual('file1');
    });

    it('Should pass the account to the endpoint', async () => {
        fetchMock.doMock();
        const mockRuleStream = Readable.from(
            [
                JSON.stringify({
                    error: null,
                    locks_stuck_cnt: 0,
                    ignore_availability: false,
                    meta: null,
                    subscription_id: null,
                    rse_expression: 'XRD1',
                    source_replica_expression: null,
                    ignore_account_limit: false,
                    created_at: 'Mon, 27 Nov 2023 17:55:34 UTC',
                    account: 'root',
                    copies: 1,
                    activity: 'User Subscriptions',
                    priority: 3,
                    updated_at: 'Mon, 27 Nov 2023 17:56:00 UTC',
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
                    state: 'OK',
                    locks_ok_cnt: 1,
                    purge_replicas: false,
                    eol_at: null,
                    id: 'e456aa5c7ae04c1cbd6c1bf9c9e6621d',
                    locks_replicating_cnt: 0,
                    split_container: false,
                    bytes: 10485760,
                }),
            ].join('\n'),
        );

        const listRulesEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules`,
            method: 'GET',
            includes: 'rules',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: mockRuleStream,
            },
            requestValidator: async req => {
                if (!req.url.includes('account=tester')) {
                    throw Error('Account is not specified or is specified incorrectly');
                }
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listRulesEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const listRulesDTO = await ruleGateway.listRules(MockRucioServerFactory.VALID_RUCIO_TOKEN, {
            account: 'tester',
        });

        expect(listRulesDTO.status).toEqual('success');
    });

    it('Should pass the scope to the endpoint', async () => {
        fetchMock.doMock();
        const mockRuleStream = Readable.from(
            [
                JSON.stringify({
                    error: null,
                    locks_stuck_cnt: 0,
                    ignore_availability: false,
                    meta: null,
                    subscription_id: null,
                    rse_expression: 'XRD1',
                    source_replica_expression: null,
                    ignore_account_limit: false,
                    created_at: 'Mon, 27 Nov 2023 17:55:34 UTC',
                    account: 'root',
                    copies: 1,
                    activity: 'User Subscriptions',
                    priority: 3,
                    updated_at: 'Mon, 27 Nov 2023 17:56:00 UTC',
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
                    state: 'OK',
                    locks_ok_cnt: 1,
                    purge_replicas: false,
                    eol_at: null,
                    id: 'e456aa5c7ae04c1cbd6c1bf9c9e6621d',
                    locks_replicating_cnt: 0,
                    split_container: false,
                    bytes: 10485760,
                }),
            ].join('\n'),
        );

        const listRulesEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules`,
            method: 'GET',
            includes: 'rules',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: mockRuleStream,
            },
            requestValidator: async req => {
                if (!req.url.includes('scope=test')) {
                    throw Error('Scope is not specified or is specified incorrectly');
                }
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listRulesEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const listRulesDTO = await ruleGateway.listRules(MockRucioServerFactory.VALID_RUCIO_TOKEN, {
            scope: 'test',
        });

        expect(listRulesDTO.status).toEqual('success');
    });

    it('Should specify * as a default parameter', async () => {
        fetchMock.doMock();
        const mockRuleStream = Readable.from(
            [
                JSON.stringify({
                    error: null,
                    locks_stuck_cnt: 0,
                    ignore_availability: false,
                    meta: null,
                    subscription_id: null,
                    rse_expression: 'XRD1',
                    source_replica_expression: null,
                    ignore_account_limit: false,
                    created_at: 'Mon, 27 Nov 2023 17:55:34 UTC',
                    account: 'root',
                    copies: 1,
                    activity: 'User Subscriptions',
                    priority: 3,
                    updated_at: 'Mon, 27 Nov 2023 17:56:00 UTC',
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
                    state: 'OK',
                    locks_ok_cnt: 1,
                    purge_replicas: false,
                    eol_at: null,
                    id: 'e456aa5c7ae04c1cbd6c1bf9c9e6621d',
                    locks_replicating_cnt: 0,
                    split_container: false,
                    bytes: 10485760,
                }),
            ].join('\n'),
        );

        const listRulesEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules`,
            method: 'GET',
            includes: 'rules',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: mockRuleStream,
            },
            requestValidator: async req => {
                if (!req.url.includes('account=*') || !req.url.includes('scope=*')) {
                    throw Error('Filter parameters do not default to *');
                }
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listRulesEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const listRulesDTO = await ruleGateway.listRules(MockRucioServerFactory.VALID_RUCIO_TOKEN);

        expect(listRulesDTO.status).toEqual('success');
    });
});
