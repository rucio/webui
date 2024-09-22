import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { DIDRulesDTO, ListDIDRulesDTO } from '@/lib/core/dto/did-dto';
import { RuleState } from '@/lib/core/entity/rucio';

describe('DID Gateway List Rules Endpoint Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didListRulesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset1/rules`,
            method: 'GET',
            includes: 'test/dataset1/rules',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(
                    [
                        JSON.stringify({
                            id: 'dummy_id',
                            subscription_id: 'sample_subscription_007',
                            account: 'dummy_account',
                            scope: 'dummy_scope',
                            name: 'dummy_name',
                            did_type: 'DATASET',
                            state: 'OK',
                            error: null,
                            rse_expression: 'dummy_rse_expression',
                            copies: 1,
                            expires_at: null,
                            weight: null,
                            locked: true,
                            locks_ok_cnt: 28635,
                            locks_replicating_cnt: 0,
                            locks_stuck_cnt: 0,
                            source_replica_expression: 'dummy_source_replica_expression',
                            activity: 'dummy_activity',
                            grouping: 'DATASET',
                            notification: 'NO',
                            stuck_at: null,
                            purge_replicas: false,
                            ignore_availability: true,
                            ignore_account_limit: false,
                            priority: 3,
                            comments: null,
                            child_rule_id: null,
                            eol_at: null,
                            split_container: false,
                            meta: null,
                            created_at: 'Fri, 09 Jun 2023 13:16:31 UTC',
                            updated_at: 'Sat, 10 Jun 2023 05:52:45 UTC',
                        }),
                        JSON.stringify({
                            id: 'abc123xyz456',
                            subscription_id: null,
                            account: 'user123',
                            scope: 'project_data',
                            name: 'experiment_data_001',
                            did_type: 'FILE',
                            state: 'PROCESSING',
                            error: null,
                            rse_expression: 'backup_storage',
                            copies: 2,
                            expires_at: null,
                            weight: null,
                            locked: false,
                            locks_ok_cnt: 789,
                            locks_replicating_cnt: 1,
                            locks_stuck_cnt: 0,
                            source_replica_expression: 'source_data_center',
                            activity: 'Data Processing',
                            grouping: 'EXPERIMENT',
                            notification: 'YES',
                            stuck_at: null,
                            purge_replicas: true,
                            ignore_availability: false,
                            ignore_account_limit: true,
                            priority: 2,
                            comments: null,
                            child_rule_id: null,
                            eol_at: null,
                            split_container: true,
                            meta: null,
                            created_at: 'Tue, 20 Jul 2023 08:45:19 UTC',
                            updated_at: 'Wed, 21 Jul 2023 14:20:37 UTC',
                        }),
                    ].join('\n'),
                ),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [didListRulesMockEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should successfully stream a list of rules for a DID', async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID);
        const dto: ListDIDRulesDTO = await rucioDIDGateway.listDIDRules(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'dataset1');
        expect(dto.status).toBe('success');

        const rulesStream = dto.stream;
        expect(rulesStream).toBeDefined();

        if (rulesStream == null || rulesStream == undefined) {
            fail('rulesStream is null or undefined');
        }

        const receivedData: any[] = [];
        const onData = (data: DIDRulesDTO) => {
            receivedData.push(data);
        };

        await new Promise((resolve, reject) => {
            rulesStream.on('data', onData);
            rulesStream.on('end', resolve);
            rulesStream.on('error', reject);
        });

        expect(receivedData.length).toBe(2);
        expect(receivedData).toEqual([
            {
                status: 'success',
                id: 'dummy_id',
                subscription_id: 'sample_subscription_007',
                account: 'dummy_account',
                name: 'dummy_name',
                state: RuleState.OK,
                last_modified: 'Sat, 10 Jun 2023 05:52:45 UTC',
            },
            {
                status: 'success',
                id: 'abc123xyz456',
                subscription_id: undefined,
                account: 'user123',
                name: 'experiment_data_001',
                state: RuleState.UNKNOWN,
                last_modified: 'Wed, 21 Jul 2023 14:20:37 UTC',
            },
        ]);
    });
});
