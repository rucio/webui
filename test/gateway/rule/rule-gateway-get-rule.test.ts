import { RuleDTO, RuleReplicaLockStateDTO } from "@/lib/core/dto/rule-dto";
import { LockState, RuleState } from "@/lib/core/entity/rucio";
import RuleGatewayOutputPort from "@/lib/core/port/secondary/rule-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import { BaseStreamableDTO } from "@/lib/sdk/dto";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { collectStreamedData } from "test/fixtures/stream-test-utils";
import { Readable } from "stream";


describe("Rule Gateway", () => {
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
                    "error": null,
                    "locks_stuck_cnt": 0,
                    "ignore_availability": false,
                    "meta": null,
                    "subscription_id": null,
                    "rse_expression": "XRD3",
                    "source_replica_expression": null,
                    "ignore_account_limit": false,
                    "created_at": "Mon, 27 Nov 2023 17:57:44 UTC",
                    "account": "root",
                    "copies": 1,
                    "activity": "User Subscriptions",
                    "priority": 3,
                    "updated_at": "Mon, 27 Nov 2023 17:57:44 UTC",
                    "scope": "test",
                    "expires_at": null,
                    "grouping": "DATASET",
                    "name": "container",
                    "weight": null,
                    "notification": "NO",
                    "comments": null,
                    "did_type": "CONTAINER",
                    "locked": false,
                    "stuck_at": null,
                    "child_rule_id": null,
                    "state": "REPLICATING",
                    "locks_ok_cnt": 0,
                    "purge_replicas": false,
                    "eol_at": null,
                    "id": "817b3030097446a38b3b842bf528e112",
                    "locks_replicating_cnt": 4,
                    "split_container": false
                })
            }
        }

        const replicaLockStates = [
            JSON.stringify({
            "scope": "test",
            "name": "file1",
            "rse_id": "c8b8113ddcdb4ec78e0846171e594280",
            "rse": "XRD3",
            "state": "REPLICATING",
            "rule_id": "817b3030097446a38b3b842bf528e112"
            }),
            JSON.stringify({
            "scope": "test",
            "name": "file2",
            "rse_id": "c8b8113ddcdb4ec78e0846171e594280",
            "rse": "XRD3",
            "state": "REPLICATING",
            "rule_id": "817b3030097446a38b3b842bf528e112"
            }),
            JSON.stringify({
            "scope": "test",
            "name": "file3",
            "rse_id": "c8b8113ddcdb4ec78e0846171e594280",
            "rse": "XRD3",
            "state": "REPLICATING",
            "rule_id": "817b3030097446a38b3b842bf528e112"
            }),
            JSON.stringify({
            "scope": "test",
            "name": "file4",
            "rse_id": "c8b8113ddcdb4ec78e0846171e594280",
            "rse": "XRD3",
            "state": "REPLICATING",
            "rule_id": "817b3030097446a38b3b842bf528e112"
            })
        ]

        const listRuleReplicaLocksEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/817b3030097446a38b3b842bf528e112/locks`,
            method: 'GET',
            endsWith: '817b3030097446a38b3b842bf528e112/locks',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body:  Readable.from(replicaLockStates.join('\n'))
            }

        }
        MockRucioServerFactory.createMockRucioServer(true, [getRuleEndpoint, listRuleReplicaLocksEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it("Should fetch details of a rule", async () => {
        const ruleGateway: RuleGatewayOutputPort = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);
        const listRuleLockStatesDTO: BaseStreamableDTO = await ruleGateway.listRuleReplicaLockStates(MockRucioServerFactory.VALID_RUCIO_TOKEN, '817b3030097446a38b3b842bf528e112');
        expect(listRuleLockStatesDTO.status).toEqual('success');

        const ruleStream = listRuleLockStatesDTO.stream;
        if(ruleStream == null || ruleStream == undefined) {
            fail('Rule stream is null or undefined');
        }

        const recievedData = await collectStreamedData<RuleReplicaLockStateDTO>(ruleStream);
        expect(recievedData.length).toEqual(4);
        expect(recievedData[0].name).toEqual('file1');
        expect(recievedData[0].state).toEqual(LockState.REPLICATING);

    });
})