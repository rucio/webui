import { RuleAnalysisDTO } from '@/lib/core/dto/rule-dto';
import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('RuleGateway Examine Rule Endpoint Tests', () => {
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should successfully examine a replicating rule', async () => {
        fetchMock.doMock();
        const examineRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/fdf8493ce00c421496e4aed30f2f0d64/analysis`,
            method: 'GET',
            includes: '/rules/fdf8493ce00c421496e4aed30f2f0d64/analysis',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rule_error: 'This replication rule is currently REPLICATING',
                    transfers: [],
                }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [examineRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: RuleAnalysisDTO = await ruleGateway.examineRule(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'fdf8493ce00c421496e4aed30f2f0d64',
        );
        expect(dto.status).toEqual('success');
        expect(dto.rule_error).toEqual('This replication rule is currently REPLICATING');
        expect(dto.transfers).toEqual([]);
    });

    it('should successfully examine a stuck rule with transfers', async () => {
        fetchMock.doMock();
        const stuckTransfers = [
            {
                scope: 'webui_test',
                name: 'testfile_rule1.dat',
                rse: 'MOCK2',
                attempts: 3,
                last_retry: 'Tue, 17 Mar 2026 15:00:00 UTC',
                last_error: 'NO_SOURCES: No sources found for DID',
                last_source: 'MOCK',
                available_sources: 'MOCK',
                blocklisted_sources: null,
            },
        ];
        const examineRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/abc123stuck/analysis`,
            method: 'GET',
            includes: '/rules/abc123stuck/analysis',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rule_error: 'Some transfers are stuck',
                    transfers: stuckTransfers,
                }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [examineRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: RuleAnalysisDTO = await ruleGateway.examineRule(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'abc123stuck');
        expect(dto.status).toEqual('success');
        expect(dto.rule_error).toEqual('Some transfers are stuck');
        expect(dto.transfers).toHaveLength(1);
        expect(dto.transfers[0].scope).toEqual('webui_test');
        expect(dto.transfers[0].name).toEqual('testfile_rule1.dat');
        expect(dto.transfers[0].attempts).toEqual(3);
    });

    it('should handle error response when examining a rule', async () => {
        fetchMock.doMock();
        const examineRuleMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/nonexistent/analysis`,
            method: 'GET',
            includes: '/rules/nonexistent/analysis',
            response: {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ExceptionMessage: 'Rule not found' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [examineRuleMockEndpoint]);

        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const dto: RuleAnalysisDTO = await ruleGateway.examineRule(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'nonexistent');
        expect(dto.status).toEqual('error');
    });
});
