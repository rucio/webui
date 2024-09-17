import { CreateRuleDTO } from '@/lib/core/dto/rule-dto';
import { RuleCreationParameters } from '@/lib/core/entity/rucio';
import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('Rule Gateway', () => {
    const creationParams: RuleCreationParameters = {
        dids: [{ scope: 'scope1', name: 'name1' }],
        copies: 1,
        rse_expression: 'rse_expression_value',
        account: 'account_value',
        grouping: 'ALL',
        weight: 10,
        lifetime: 3600,
        locked: true,
        subscription_id: 'sub_id',
        source_replica_expression: 'source_replica',
        activity: 'activity_name',
        notify: 'Y',
        purge_replicas: false,
        ignore_availability: true,
        comments: 'Test comment',
        ask_approval: true,
        asynchronous: false,
        priority: 3,
        split_container: false,
        meta: 'some_meta_data',
    };

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
                body: JSON.stringify(['817b3030097446a38b3b842bf528e112']),
            },
            requestValidator: async req => {
                const bodyJson = await req.text();
                return bodyJson === JSON.stringify(creationParams);
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [createRuleEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should pass all of the parameters on rule creation', async () => {
        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const createRuleDTO: CreateRuleDTO = await ruleGateway.createRule(MockRucioServerFactory.VALID_RUCIO_TOKEN, creationParams);
        expect(createRuleDTO.status).toEqual('success');
        expect(createRuleDTO.rule_ids.length).toEqual(1);
    });
});
