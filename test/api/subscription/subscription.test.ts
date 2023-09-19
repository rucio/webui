import { Subscription, SubscriptionState } from "@/lib/core/entity/rucio";
import { GetSubscriptionRequest } from "@/lib/core/usecase-models/get-subscription-usecase-models";
import { GetSubscriptionControllerParameters } from "@/lib/infrastructure/controller/get-subscription-controller";
import { SubscriptionViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiResponse } from "next";
import { createHttpMocks } from "test/fixtures/http-fixtures";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe("GET Subscription Feature Tests", () => {
    beforeEach(() => {
        fetchMock.doMock()
        const getSubscriptionEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/subscriptions/ddmadmin/*Functional%20Test`,
            method: 'GET',
            includes: 'subscriptions/ddmadmin/*Functional Test',
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
        MockRucioServerFactory.createMockRucioServer(true, [getSubscriptionEndpoint]);

    });
    afterEach(() => {
        fetchMock.dontMock()
    });

    it("should get subscription", async () => {
        const { req, res, session } = await createHttpMocks('/api/feature/get-subscription/ddmadmin/*Functional%20Test', 'GET', {});

        const getSubscriptionController = appContainer.get<BaseController<GetSubscriptionControllerParameters, GetSubscriptionRequest>>(CONTROLLERS.GET_SUBSCRIPTION);
        const getSubscriptionControllerParams: GetSubscriptionControllerParameters = {
            name: '*Functional Test',
            sessionAccount: 'ddmadmin',
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse
        }

        await getSubscriptionController.execute(getSubscriptionControllerParams);
        expect(res._getStatusCode()).toBe(200);
        const subscription: SubscriptionViewModel = JSON.parse(res._getData());
        expect(subscription.status).toBe('success');
        expect(subscription.id).toEqual('bccaabb5877a443abd6c56f3271557df');
        expect(subscription.name).toEqual('*Functional Test');
        expect(subscription.state).toEqual(SubscriptionState.UPDATED);
        expect(subscription.account).toEqual('ddmadmin');
        expect(subscription.lifetime).toEqual('Sun, 25 May 2042 15:41:54 UTC');

        const replicationRules = JSON.parse(subscription.replication_rules);
        expect(replicationRules.length).toEqual(3);
        expect(replicationRules[0].activity).toEqual('Functional Test');
        expect(replicationRules[0].rse_expression).toEqual('tier=1&type=DATADISK');
        expect(replicationRules[0].source_replica_expression).toEqual('CERN-PROD_DATADISK');
        expect(replicationRules[0].copies).toEqual('*');
        expect(replicationRules[0].lifetime).toEqual(172800);
        expect(replicationRules[0].comments).toEqual('Functional tests from Tier-0 to Tier-1s');
    });
});