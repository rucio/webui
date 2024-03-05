import { RuleState } from "@/lib/core/entity/rucio";
import ListRulesForAccountController, { ListRulesForAccountControllerParameters } from "@/lib/infrastructure/controller/list-rules-for-account-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { NextApiResponse } from "next";
import { MockHttpStreamableResponseFactory } from "test/fixtures/http-fixtures";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { collectStreamedData } from "test/fixtures/stream-test-utils";
import { Readable } from "stream";

describe("List DID Rules Feature tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const mockedRuleList = Readable.from([
            JSON.stringify({"name": "file1", "locked": false, "notification": "NO", "child_rule_id": null, "did_type": "FILE", "locks_ok_cnt": 1, "stuck_at": null, "eol_at": null, "id": "ccce05aed65b4de3b7291339894920cf", "state": "Stuck", "locks_replicating_cnt": 0, "purge_replicas": false, "split_container": false, "error": null, "locks_stuck_cnt": 0, "ignore_availability": false, "meta": null, "subscription_id": null, "rse_expression": "XRD1", "source_replica_expression": null, "ignore_account_limit": false, "created_at": "Thu, 15 Feb 2024 10:14:19 UTC", "account": "root", "copies": 1, "activity": "User Subscriptions", "priority": 3, "updated_at": "Thu, 15 Feb 2024 10:14:24 UTC", "scope": "test", "expires_at": null, "grouping": "DATASET", "weight": null, "comments": null, "bytes": 10485760}),
            JSON.stringify({"name": "file2", "locked": false, "notification": "NO", "child_rule_id": null, "did_type": "FILE", "locks_ok_cnt": 1, "stuck_at": null, "eol_at": null, "id": "fa19a5181a2642bea1363f876d1f98ee", "state": "OK", "locks_replicating_cnt": 0, "purge_replicas": false, "split_container": false, "error": null, "locks_stuck_cnt": 0, "ignore_availability": false, "meta": null, "subscription_id": null, "rse_expression": "XRD1", "source_replica_expression": null, "ignore_account_limit": false, "created_at": "Thu, 15 Feb 2024 10:14:27 UTC", "account": "root", "copies": 1, "activity": "User Subscriptions", "priority": 3, "updated_at": "Thu, 15 Feb 2024 10:14:32 UTC", "scope": "test", "expires_at": null, "grouping": "DATASET", "weight": null, "comments": null, "bytes": 10485760}),
            JSON.stringify({"name": "file3", "locked": false, "notification": "NO", "child_rule_id": null, "did_type": "FILE", "locks_ok_cnt": 1, "stuck_at": null, "eol_at": null, "id": "70f474d191e241afb3334ba3a2c3edc1", "state": "OK", "locks_replicating_cnt": 0, "purge_replicas": false, "split_container": false, "error": null, "locks_stuck_cnt": 0, "ignore_availability": false, "meta": null, "subscription_id": null, "rse_expression": "XRD2", "source_replica_expression": null, "ignore_account_limit": false, "created_at": "Thu, 15 Feb 2024 10:14:35 UTC", "account": "root", "copies": 1, "activity": "User Subscriptions", "priority": 3, "updated_at": "Thu, 15 Feb 2024 10:14:40 UTC", "scope": "test", "expires_at": null, "grouping": "DATASET", "weight": null, "comments": null, "bytes": 10485760}),
        ].join('\n'));
        const listRulesEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/`,
            method: "GET",
            endsWith: "rules/",
            response: {
                status: 200,
                headers: {
                    "Content-Type": "application/x-json-stream",
                },
                body: mockedRuleList
            },
        }
        MockRucioServerFactory.createMockRucioServer(true, [listRulesEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
        fetchMock.resetMocks();
    });

    it("should list rules for demo account", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller: ListRulesForAccountController = appContainer.get<ListRulesForAccountController>(CONTROLLERS.LIST_RULES_FOR_ACCOUNT);
        const controllerParams: ListRulesForAccountControllerParameters = {
            account: "demo",
            rseExpression: "CERN-PROD_DATADISK",
            activity: "Functional Test",
            ruleState: RuleState.OK,
            from: new Date('2024-01-10'),
            to: new Date('2024-01-11'),
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
        }
        
        await controller.execute(controllerParams);

        const recievedData: string[] = await collectStreamedData<string>(res)

        expect(recievedData).toHaveLength(3);

        // check if all rule states in received data are RuleState.OK
        for (const rule of recievedData) {
            const ruleObj = JSON.parse(rule);
            expect(ruleObj.state).toEqual(RuleState.OK);
        }


    });
});