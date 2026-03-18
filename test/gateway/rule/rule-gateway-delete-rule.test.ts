import { DeleteRuleDTO } from '@/lib/core/dto/rule-dto';
import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('RuleGateway Delete Rule Endpoint Tests', () => {
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should successfully delete a rule', async () => {
        fetchMock.doMock();
        const deleteRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/657c2650725d432fab3f1dc14128e9fb`,
            method: 'DELETE',
            includes: '/rules/657c2650725d432fab3f1dc14128e9fb',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: '',
            },
            requestValidator: async (req: Request) => {
                const body = await req.json();
                return body !== undefined && typeof body === 'object';
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [deleteRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: DeleteRuleDTO = await ruleGateway.deleteRule(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            '657c2650725d432fab3f1dc14128e9fb',
        );
        expect(dto.status).toEqual('success');
    });

    it('should handle error when rule does not exist', async () => {
        fetchMock.doMock();
        const deleteRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/nonexistent`,
            method: 'DELETE',
            includes: '/rules/nonexistent',
            response: {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ExceptionMessage: 'Rule not found' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [deleteRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: DeleteRuleDTO = await ruleGateway.deleteRule(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'nonexistent',
        );
        expect(dto.status).toEqual('error');
    });

    it('should handle error when no body is sent (400 bad request)', async () => {
        fetchMock.doMock();
        const deleteRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/657c2650725d432fab3f1dc14128e9fb`,
            method: 'DELETE',
            includes: '/rules/657c2650725d432fab3f1dc14128e9fb',
            response: {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ExceptionMessage: 'ValueError: cannot decode json parameter dictionary' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [deleteRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: DeleteRuleDTO = await ruleGateway.deleteRule(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            '657c2650725d432fab3f1dc14128e9fb',
        );
        expect(dto.status).toEqual('error');
    });
});
