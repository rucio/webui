import { SubscriptionState } from "@/lib/core/entity/rucio";
import EnvConfigGatewayOutputPort from "@/lib/core/port/secondary/env-config-gateway-output-port";
import SubscriptionGatewayOutputPort from "@/lib/core/port/secondary/subscription-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe('SubscriptionGateway', () => {
    beforeEach(() => {
        fetchMock.doMock();
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
        fetchMock.dontMock();
    });

    it('Should fetch a subscription', async () => {
        const subscriptionGateway: SubscriptionGatewayOutputPort = appContainer.get<SubscriptionGatewayOutputPort>(GATEWAYS.SUBSCRIPTION);
        const subscription = await subscriptionGateway.get(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'ddmadmin', '*Functional Test');
        expect(subscription.id).toEqual('bccaabb5877a443abd6c56f3271557df');
        expect(subscription.name).toEqual('*Functional Test');
        expect(subscription.state).toEqual(SubscriptionState.UPDATED);
        expect(subscription.account).toEqual('ddmadmin');
        expect(subscription.lifetime).toEqual('Sun, 25 May 2042 15:41:54 UTC');
        expect(subscription.replication_rules.length).toEqual(3);
        expect(subscription.replication_rules[0].activity).toEqual('Functional Test');
        expect(subscription.replication_rules[0].rse_expression).toEqual('tier=1&type=DATADISK');
        expect(subscription.replication_rules[0].source_replica_expression).toEqual('CERN-PROD_DATADISK');
        expect(subscription.replication_rules[0].copies).toEqual('*');
        expect(subscription.replication_rules[0].lifetime).toEqual(172800);
        expect(subscription.replication_rules[0].comments).toEqual('Functional tests from Tier-0 to Tier-1s');
        
    
    });
});