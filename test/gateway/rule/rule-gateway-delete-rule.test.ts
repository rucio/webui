import { DeleteRuleDTO } from '@/lib/core/dto/rule-dto';
import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

/**
 * Tests for the RuleGateway DELETE endpoint (hard delete via Rucio DELETE /rules/{id}).
 *
 * Note on soft-delete vs force-delete vs hard-delete:
 *   - Soft-delete  (UI "Delete" action):       calls updateRule({ lifetime: 3600 }) → PUT /rules/{id}
 *   - Force-delete (UI "Force Delete" checkbox): calls updateRule({ lifetime: 0 })   → PUT /rules/{id}
 *   - Hard-delete  (this gateway method):       calls deleteRule()                   → DELETE /rules/{id}
 *
 * Coverage for soft-delete (lifetime=3600) and force-delete (lifetime=0) payloads lives in
 * rule-gateway-update-rule.test.ts since those flows go through the updateRule gateway method.
 */
describe('RuleGateway Delete Rule Endpoint Tests', () => {
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should successfully delete a rule', async () => {
        fetchMock.doMock();
        // Use a spy to capture the raw request body so we can assert explicitly that the
        // hard-delete endpoint receives NO `lifetime` field.  Without this, a validation
        // failure inside requestValidator would only surface as a status mismatch, making
        // the failure message unhelpful.
        const captureBody = jest.fn<void, [Record<string, unknown>]>();
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
                // The DELETE endpoint sends an empty JSON body ({}) — no lifetime parameter.
                // Lifetime-based deletion is handled by the update-rule (PUT) pathway.
                const body = await req.json();
                captureBody(body);
                return body !== undefined && typeof body === 'object' && !('lifetime' in body);
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [deleteRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: DeleteRuleDTO = await ruleGateway.deleteRule(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            '657c2650725d432fab3f1dc14128e9fb',
        );
        expect(dto.status).toEqual('success');
        // Explicitly assert the gateway sent a body without a lifetime field.
        // This produces a clear failure message if the implementation accidentally includes it.
        expect(captureBody).toHaveBeenCalledTimes(1);
        const sentBody = captureBody.mock.calls[0][0];
        expect(sentBody).not.toHaveProperty('lifetime');
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
