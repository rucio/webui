import { RuleReplicaLockStateDTO } from '@/lib/core/dto/rule-dto';
import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { Readable } from 'stream';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { collectStreamedData } from 'test/fixtures/stream-test-utils';

describe('RuleGateway', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const ruleReplicaLockStateStream = Readable.from([
            JSON.stringify({
                scope: 'test',
                name: 'file1',
                rse_id: 'e815ec46bfa2427cac191cc36ac94527',
                rse: 'XRD3',
                state: 'REPLICATING',
                rule_id: '0dcdc93fab714f8b84bad116c409483b',
            }) + '\n',
            JSON.stringify({
                scope: 'test',
                name: 'file2',
                rse_id: 'e815ec46bfa2427cac191cc36ac94527',
                rse: 'XRD3',
                state: 'REPLICATING',
                rule_id: '0dcdc93fab714f8b84bad116c409483b',
            }) + '\n',
            JSON.stringify({
                scope: 'test',
                name: 'file3',
                rse_id: 'e815ec46bfa2427cac191cc36ac94527',
                rse: 'XRD3',
                state: 'REPLICATING',
                rule_id: '0dcdc93fab714f8b84bad116c409483b',
            }) + '\n',
            JSON.stringify({
                scope: 'test',
                name: 'file4',
                rse_id: 'e815ec46bfa2427cac191cc36ac94527',
                rse: 'XRD3',
                state: 'REPLICATING',
                rule_id: '0dcdc93fab714f8b84bad116c409483b',
            }) + '\n',
        ]);

        const listRuleReplicaLockStatesEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/0dcdc93fab714f8b84bad116c409483b/locks`,
            method: 'GET',
            includes: 'locks',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: ruleReplicaLockStateStream,
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listRuleReplicaLockStatesEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should fetch a list of rule replica lock states', async () => {
        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const listRuleReplicaLockStatesDTO = await ruleGateway.listRuleReplicaLockStates(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            '0dcdc93fab714f8b84bad116c409483b',
        );
        expect(listRuleReplicaLockStatesDTO.status).toEqual('success');

        const ruleReplicaLockStateStream = listRuleReplicaLockStatesDTO.stream;
        if (ruleReplicaLockStateStream == null || ruleReplicaLockStateStream == undefined) {
            fail('Rule replica lock state stream is null or undefined');
        }

        const recievedData = await collectStreamedData<RuleReplicaLockStateDTO>(ruleReplicaLockStateStream);
        expect(recievedData.length).toEqual(4);
        expect(recievedData[0].rse).toEqual('XRD3');
        expect(recievedData[0].name).toEqual('file1');
    });
});
