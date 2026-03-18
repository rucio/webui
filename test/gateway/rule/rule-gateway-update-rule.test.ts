import { UpdateRuleDTO } from '@/lib/core/dto/rule-dto';
import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('RuleGateway Update Rule Endpoint Tests', () => {
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should successfully update rule lifetime (extend expiration)', async () => {
        fetchMock.doMock();
        const updateRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/fdc8ae7f04894bf5bf328bf610e21315`,
            method: 'PUT',
            includes: '/rules/fdc8ae7f04894bf5bf328bf610e21315',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: '',
            },
            requestValidator: async (req: Request) => {
                const body = await req.json();
                return body.options && typeof body.options.lifetime === 'number';
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [updateRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: UpdateRuleDTO = await ruleGateway.updateRule(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'fdc8ae7f04894bf5bf328bf610e21315',
            { lifetime: 172800 },
        );
        expect(dto.status).toEqual('success');
    });

    it('should successfully clear rule expiration', async () => {
        fetchMock.doMock();
        const updateRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/fdf8493ce00c421496e4aed30f2f0d64`,
            method: 'PUT',
            includes: '/rules/fdf8493ce00c421496e4aed30f2f0d64',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: '',
            },
            requestValidator: async (req: Request) => {
                const body = await req.json();
                return body.options && body.options.lifetime === null;
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [updateRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: UpdateRuleDTO = await ruleGateway.updateRule(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'fdf8493ce00c421496e4aed30f2f0d64',
            { lifetime: null },
        );
        expect(dto.status).toEqual('success');
    });

    it('should successfully approve a rule', async () => {
        fetchMock.doMock();
        const updateRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/fdf8493ce00c421496e4aed30f2f0d64`,
            method: 'PUT',
            includes: '/rules/fdf8493ce00c421496e4aed30f2f0d64',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: '',
            },
            requestValidator: async (req: Request) => {
                const body = await req.json();
                return body.options && body.options.approve === true;
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [updateRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: UpdateRuleDTO = await ruleGateway.updateRule(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'fdf8493ce00c421496e4aed30f2f0d64',
            { approve: true },
        );
        expect(dto.status).toEqual('success');
    });

    it('should successfully boost rule priority', async () => {
        fetchMock.doMock();
        const updateRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/fdf8493ce00c421496e4aed30f2f0d64`,
            method: 'PUT',
            includes: '/rules/fdf8493ce00c421496e4aed30f2f0d64',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: '',
            },
            requestValidator: async (req: Request) => {
                const body = await req.json();
                return body.options && body.options.priority === 5;
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [updateRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: UpdateRuleDTO = await ruleGateway.updateRule(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'fdf8493ce00c421496e4aed30f2f0d64',
            { priority: 5 },
        );
        expect(dto.status).toEqual('success');
    });

    it('should handle error response when updating a rule', async () => {
        fetchMock.doMock();
        const updateRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/nonexistent`,
            method: 'PUT',
            includes: '/rules/nonexistent',
            response: {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ExceptionMessage: 'Rule not found' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [updateRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: UpdateRuleDTO = await ruleGateway.updateRule(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'nonexistent', { lifetime: 86400 });
        expect(dto.status).toEqual('error');
    });
});
