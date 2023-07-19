import { SubscriptionReplicationRule, SubscriptionState } from "@/lib/core/entity/rucio";
import { ListSubscriptionsRequest } from "@/lib/core/usecase-models/list-subscriptions-usecase-models";
import { ListSubscriptionsControllerParameters } from "@/lib/infrastructure/controller/list-subscriptions-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiResponse } from "next";
import { Readable } from "stream";
import { createHttpMocks, MockHttpStreamableResponseFactory } from "test/fixtures/http-fixtures";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe("List Subscription Feature tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const subscriptionStream = Readable.from([
            JSON.stringify({"id": "c674f72385a14dc8bb5ceba3e491da5a", "name": "wguan test weight", "filter": "{\"scope\": [\"tests\"]}", "replication_rules": "[{\"rse_expression\": \"INFN-T1_SCRATCHDISK|IN2P3-CC_SCRATCHDISK\", \"copies\": 1, \"weight\": \"stresstestweight\"}]", "policyid": 0, "state": "INACTIVE", "last_processed": "Thu, 17 Jul 2014 07:21:03 UTC", "account": "ddmadmin", "lifetime": "Tue, 01 May 2288 07:21:03 UTC", "comments": null, "retroactive": false, "expired_at": null, "created_at": "Thu, 17 Jul 2014 07:21:04 UTC", "updated_at": "Thu, 17 Jul 2014 07:21:04 UTC"}),
            JSON.stringify({"id": "f8fb1e9b69e842daa0e1a29914114593", "name": "Functional test T2", "filter": "{\"project\": [\"step14\"], \"scope\": [\"tests\"], \"split_rule\": true, \"transient\": [\"None\", \"0\"]}", "replication_rules": "[{\"lifetime\": 172800, \"activity\": \"Functional Test\", \"copies\": 20, \"source_replica_expression\": \"tier=1\\\\site=CERN-PROD\", \"rse_expression\": \"(tier=2&type=DATADISK\\\\ruciotestsite=true)\\\\todecommission=true\"}]", "policyid": 0, "state": "INACTIVE", "last_processed": "Thu, 19 May 2022 11:46:11 UTC", "account": "ddmadmin", "lifetime": "Sun, 25 May 2042 15:58:21 UTC", "comments": "Functional tests from T1 to T2", "retroactive": false, "expired_at": null, "created_at": "Mon, 21 Jul 2014 12:18:39 UTC", "updated_at": "Thu, 19 May 2022 11:46:13 UTC"}),
            JSON.stringify({"id": "6171d1b00b424e41a3c5c73c4cdb20b5", "name": "T0 AOD to nucleus", "filter": "{\"scope\": [\"data15_13TeV\", \"data15_5TeV\", \"data15_900GeV\", \"data15_comm\", \"data15_cos\", \"data15_hi\", \"data16_13TeV\", \"data16_14TeV\", \"data16_comm\", \"data16_cos\", \"data16_hip5TeV\", \"data16_hip8TeV\", \"data17_13TeV\", \"data17_5TeV\", \"data17_900GeV\", \"data17_comm\", \"data17_cos\", \"data17_hi\", \"data18_13TeV\", \"data18_1beam\", \"data18_1p8TeV\", \"data18_900GeV\", \"data18_calib\", \"data18_comm\", \"data18_cos\", \"data18_hi\", \"data22_13p6TeV\", \"data22_900GeV\", \"data22_comm\", \"data22_cos\", \"data22_hi\", \"data22_idcomm\"], \"datatype\": [\"AOD\"], \"transient\": [\"None\", \"0\"], \"prod_step\": [\"merge\"], \"did_type\": [\"DATASET\"], \"split_rule\": true}", "replication_rules": "[{\"copies\": 1, \"rse_expression\": \"type=DATADISK&datapolicynucleus=true\", \"activity\": \"T0 Export\", \"weight\": \"mouweight\"}]", "policyid": 3, "state": "INACTIVE", "last_processed": "Thu, 28 Jul 2022 09:11:28 UTC", "account": "ddmadmin", "lifetime": "Wed, 27 Jul 2022 09:11:49 UTC", "comments": "T0 AOD to nucleus (permanent)", "retroactive": false, "expired_at": "Thu, 28 Jul 2022 09:12:07 UTC", "created_at": "Fri, 29 May 2015 12:01:44 UTC", "updated_at": "Thu, 28 Jul 2022 09:12:07 UTC"})
        ].join('\n'))

        const listSubscriptionsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/subscriptions/ddmadmin`,
            method: 'GET',
            includes: 'subscriptions/ddmadmin',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: subscriptionStream
            }
        }

        MockRucioServerFactory.createMockRucioServer(true, [listSubscriptionsEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
    
    it("should list subscriptions as a stream", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()

        const listSubscriptionsController = appContainer.get<BaseController<ListSubscriptionsControllerParameters, ListSubscriptionsRequest>>(CONTROLLERS.LIST_SUBSCRIPTIONS);
        const listSubscriptionsControllerParams: ListSubscriptionsControllerParameters = {
            account: 'ddmadmin',
            sessionAccount: 'ddmadmin',
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse
        }

        await listSubscriptionsController.execute(listSubscriptionsControllerParams);

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

        expect(receivedData.length).toEqual(3)
        expect(receivedData[0].id).toEqual('c674f72385a14dc8bb5ceba3e491da5a')
        expect(receivedData[0].name).toEqual('wguan test weight')
        expect(receivedData[0].filter).toEqual('{"scope": ["tests"]}')
        expect(receivedData[0].policyid).toEqual(0)
        expect(receivedData[0].state).toEqual(SubscriptionState.INACTIVE)
        expect(receivedData[0].last_processed).toEqual('Thu, 17 Jul 2014 07:21:03 UTC')
        expect(receivedData[0].account).toEqual('ddmadmin')
        expect(receivedData[0].lifetime).toEqual('Tue, 01 May 2288 07:21:03 UTC')
        expect(receivedData[0].comments).toEqual(undefined)

        const rules: SubscriptionReplicationRule[] = JSON.parse(receivedData[0].replication_rules)
        expect(rules.length).toEqual(1)
        const rule = rules[0]
        expect(rule.rse_expression).toEqual('INFN-T1_SCRATCHDISK|IN2P3-CC_SCRATCHDISK')
        expect(rule.copies).toEqual(1)
        expect(rule.weight).toEqual('stresstestweight')
    });

})