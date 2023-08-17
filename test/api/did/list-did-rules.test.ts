import { ListDIDRulesRequest } from "@/lib/core/usecase-models/list-did-rules-usecase-models";
import { ListDIDRulesControllerParameters } from "@/lib/infrastructure/controller/list-did-rules-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiResponse } from "next";
import { MockHttpStreamableResponseFactory } from "test/fixtures/http-fixtures";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { Readable } from "stream";

describe("List DID Rules Feature tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didListRulesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset1/rules`,
            method: "GET",
            includes: "test/dataset1/rules",
            response: {
                status: 200,
                headers: {
                    "Content-Type": "application/x-json-stream",
                },
                body: Readable.from( [
                    JSON.stringify({"id":"dummy_id","subscription_id":"sample_subscription_007","account":"dummy_account","scope":"dummy_scope","name":"dummy_name","did_type":"DATASET","state":"OK","error":null,"rse_expression":"dummy_rse_expression","copies":1,"expires_at":null,"weight":null,"locked":true,"locks_ok_cnt":28635,"locks_replicating_cnt":0,"locks_stuck_cnt":0,"source_replica_expression":"dummy_source_replica_expression","activity":"dummy_activity","grouping":"DATASET","notification":"NO","stuck_at":null,"purge_replicas":false,"ignore_availability":true,"ignore_account_limit":false,"priority":3,"comments":null,"child_rule_id":null,"eol_at":null,"split_container":false,"meta":null,"created_at":"Fri, 09 Jun 2023 13:16:31 UTC","updated_at":"Sat, 10 Jun 2023 05:52:45 UTC"}),
                ]),
            },
        };

        const getSubscriptionEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/subscriptions/Id/sample_subscription_007`,
            method: 'GET',
            includes: 'subscriptions/Id/sample_subscription_007',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: JSON.stringify({
                    "id": "bccaabb5877a443abd6c56f3271557df",
                    "name": "*Functional Test",
                    "filter": "{\"scope\": [\"tests\"], \"project\": [\"step14\"], \"split_rule\": true}",
                    "replication_rules": "[{\"activity\": \"Functional Test\", \"rse_expression\": \"tier=1&type=DATADISK\", \"source_replica_expression\": \"CERN-PROD_DATADISK\", \"copies\": \"*\", \"lifetime\": 172800, \"comments\": \"Functional tests from Tier-0 to Tier-1s\"}, {\"activity\": \"Functional Test\", \"rse_expression\": \"tier=2&type=DATADISK\", \"source_replica_expression\": \"tier=1&type=DATADISK\", \"copies\": \"*\", \"lifetime\": 172800, \"comments\": \"Functional tests from Tier-1s to Tier-2s\"}, {\"activity\": \"Functional Test\", \"rse_expression\": \"type=TEST\", \"copies\": \"*\", \"lifetime\": 172800, \"comments\": \"Functional tests to RSEs of type TEST\"}]",
                    "policyid": 0,
                    "state": "UPDATED",
                    "last_processed": "Tue, 18 Jul 2023 12:00:30 UTC",
                    "account": "ddmadmin",
                    "lifetime": "Sun, 25 May 2042 15:41:54 UTC",
                    "comments": "The Automatix daemon is configured to periodically produce small datasets for testing purposes and upload them to CERN-PROD_DATADISK. This subscription creates replication rules from Tier-0 to the Tier-1 DATADISKs, from the Tier-1s to the Tier-2 DATADISKs, and from anywhere to RSEs of type TEST. All created rules and the datasets themselves have a lifetime of 2 days.",
                    "retroactive": false,
                    "expired_at": null,
                    "created_at": "Wed, 21 May 2014 08:40:15 UTC",
                    "updated_at": "Tue, 18 Jul 2023 12:00:30 UTC" 
                })
            }
        }

        MockRucioServerFactory.createMockRucioServer(true, [didListRulesMockEndpoint, getSubscriptionEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it("should list DID rules", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const listDIDRulesController = appContainer.get<BaseController<ListDIDRulesControllerParameters, ListDIDRulesRequest>>(CONTROLLERS.LIST_DID_RULES);
        const listDIDRulesControllerParams: ListDIDRulesControllerParameters = {
            account: 'ddmadmin',
            sessionAccount: 'ddmadmin',
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            name: 'dataset1',
            scope: 'test'
        }

        await listDIDRulesController.execute(listDIDRulesControllerParams);

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
        console.log(receivedData)
        expect(receivedData.length).toBe(2) //TODO: why is this 2?
        expect(receivedData[0].id).toBe('dummy_id')
        expect(receivedData[0].subscription).toEqual({
            name: '*Functional Test',
            account: 'ddmadmin'
        })
        expect(receivedData[0].account).toBe('dummy_account')        

    });
});