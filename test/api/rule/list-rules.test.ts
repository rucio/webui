import appContainer from "@/lib/infrastructure/ioc/container-config";
import {ListRulesRequest} from "@/lib/core/usecase-models/list-rules-usecase-models";
import {ListRulesControllerParameters} from "@/lib/infrastructure/controller/list-rules-controller"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"

import {NextApiResponse} from "next";
import {MockHttpStreamableResponseFactory} from "test/fixtures/http-fixtures";
import {Readable} from "stream";
import MockRucioServerFactory, {MockEndpoint} from "../../fixtures/rucio-server";
import {BaseController} from "@/lib/sdk/controller";

describe("Feature: ListRules", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const mockRule = {
            "subscription_id": null,
            "rse_expression": "MOCK|MOCK2|MOCK3",
            "source_replica_expression": null,
            "ignore_account_limit": false,
            "created_at": "Thu, 15 Aug 2024 10:59:39 UTC",
            "account": "root",
            "copies": 2,
            "activity": "User Subscriptions",
            "priority": 3,
            "updated_at": "Thu, 15 Aug 2024 10:59:39 UTC",
            "scope": "test",
            "expires_at": null,
            "grouping": "DATASET",
            "name": "file1",
            "weight": null,
            "notification": "NO",
            "comments": null,
            "did_type": "FILE",
            "locked": false,
            "stuck_at": null,
            "child_rule_id": null,
            "state": "REPLICATING",
            "locks_ok_cnt": 0,
            "purge_replicas": false,
            "eol_at": null,
            "id": "5ec54948fb0f4e80b57732b1ba92572c",
            "error": null,
            "locks_replicating_cnt": 2,
            "ignore_availability": false,
            "split_container": false,
            "locks_stuck_cnt": 0,
            "meta": null,
            "bytes": 10485760
        };

        const listRulesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules`,
            method: 'GET',
            includes: 'rules',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: Readable.from([
                    JSON.stringify(mockRule),
                    JSON.stringify(mockRule),
                ].join('\n')),
            }
        }
        MockRucioServerFactory.createMockRucioServer(true, [listRulesMockEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it("should return a view model for a valid request to ListRules feature", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const listRulesController = appContainer.get<BaseController<ListRulesControllerParameters, ListRulesRequest>>(CONTROLLERS.LIST_RULES);
        const listRulesControllerParams: ListRulesControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        }

        await listRulesController.execute(listRulesControllerParams);

        const receivedData: any[] = []
        const onData = (data: any) => {
            receivedData.push(JSON.parse(data))
        }

        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData)
            res.on('end', () => {
                res.off('data', onData)
                resolve()
            })
            res.on('error', err => {
                res.off('data', onData)
                reject(err)
            })
        })

        await done
        expect(receivedData.length).toEqual(2);
        expect(receivedData[0].status).toEqual('success');
        expect(receivedData[0].name).toEqual('file1');
        expect(receivedData[1].account).toEqual('root');
    });
});