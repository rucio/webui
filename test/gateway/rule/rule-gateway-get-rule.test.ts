import { RuleMetaDTO } from '@/lib/core/dto/rule-dto';
import { DIDType, RuleGrouping, RuleNotification, RuleState } from '@/lib/core/entity/rucio';
import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

// TODO: extend the test
describe('Rule Gateway', () => {
    const expectedDTO: RuleMetaDTO = {
        status: 'success',
        locks_stuck_cnt: 0,
        ignore_account_limit: false,
        ignore_availability: false,
        rse_expression: 'XRD3',
        created_at: 'Mon, 27 Nov 2023 17:57:44 UTC',
        account: 'root',
        copies: 1,
        activity: 'User Subscriptions',
        priority: 3,
        updated_at: 'Mon, 27 Nov 2023 17:57:44 UTC',
        scope: 'test',
        expires_at: null,
        grouping: RuleGrouping.DATASET,
        name: 'container',
        notification: RuleNotification.No,
        did_type: DIDType.CONTAINER,
        locked: false,
        state: RuleState.REPLICATING,
        locks_ok_cnt: 0,
        purge_replicas: false,
        id: '817b3030097446a38b3b842bf528e112',
        locks_replicating_cnt: 4,
        split_container: false,
    };

    beforeEach(() => {
        fetchMock.doMock();
        const getRuleEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/817b3030097446a38b3b842bf528e112`,
            method: 'GET',
            endsWith: '817b3030097446a38b3b842bf528e112',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: JSON.stringify({
                    error: null,
                    locks_stuck_cnt: 0,
                    ignore_availability: false,
                    meta: null,
                    subscription_id: null,
                    rse_expression: 'XRD3',
                    source_replica_expression: null,
                    ignore_account_limit: false,
                    created_at: 'Mon, 27 Nov 2023 17:57:44 UTC',
                    account: 'root',
                    copies: 1,
                    activity: 'User Subscriptions',
                    priority: 3,
                    updated_at: 'Mon, 27 Nov 2023 17:57:44 UTC',
                    scope: 'test',
                    expires_at: null,
                    grouping: 'DATASET',
                    name: 'container',
                    weight: null,
                    notification: 'NO',
                    comments: null,
                    did_type: 'CONTAINER',
                    locked: false,
                    stuck_at: null,
                    child_rule_id: null,
                    state: 'REPLICATING',
                    locks_ok_cnt: 0,
                    purge_replicas: false,
                    eol_at: null,
                    id: '817b3030097446a38b3b842bf528e112',
                    locks_replicating_cnt: 4,
                    split_container: false,
                }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [getRuleEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should fetch details for a rule', async () => {
        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const ruleMetaDTO: RuleMetaDTO = await ruleGateway.getRule(MockRucioServerFactory.VALID_RUCIO_TOKEN, '817b3030097446a38b3b842bf528e112');
        expect(ruleMetaDTO).toEqual(expectedDTO);
    });
});
