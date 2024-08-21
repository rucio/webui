import { SubscriptionState } from '@/lib/core/entity/rucio';
import SubscriptionGatewayOutputPort from '@/lib/core/port/secondary/subscription-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import { ListSubscriptionsDTO, SubscriptionDTO } from '@/lib/core/dto/subscription-dto';

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
                    id: 'bccaabb5877a443abd6c56f3271557df',
                    name: '*Functional Test',
                    filter: '{"scope": ["tests"], "project": ["step14"], "split_rule": true}',
                    replication_rules:
                        '[{"activity": "Functional Test", "rse_expression": "tier=1&type=DATADISK", "source_replica_expression": "CERN-PROD_DATADISK", "copies": "*", "lifetime": 172800, "comments": "Functional tests from Tier-0 to Tier-1s"}, {"activity": "Functional Test", "rse_expression": "tier=2&type=DATADISK", "source_replica_expression": "tier=1&type=DATADISK", "copies": "*", "lifetime": 172800, "comments": "Functional tests from Tier-1s to Tier-2s"}, {"activity": "Functional Test", "rse_expression": "type=TEST", "copies": "*", "lifetime": 172800, "comments": "Functional tests to RSEs of type TEST"}]',
                    policyid: 0,
                    state: 'UPDATED',
                    last_processed: 'Tue, 18 Jul 2023 12:00:30 UTC',
                    account: 'ddmadmin',
                    lifetime: 'Sun, 25 May 2042 15:41:54 UTC',
                    comments:
                        'The Automatix daemon is configured to periodically produce small datasets for testing purposes and upload them to CERN-PROD_DATADISK. This subscription creates replication rules from Tier-0 to the Tier-1 DATADISKs, from the Tier-1s to the Tier-2 DATADISKs, and from anywhere to RSEs of type TEST. All created rules and the datasets themselves have a lifetime of 2 days.',
                    retroactive: false,
                    expired_at: null,
                    created_at: 'Wed, 21 May 2014 08:40:15 UTC',
                    updated_at: 'Tue, 18 Jul 2023 12:00:30 UTC',
                }),
            },
        };

        const getSubscriptionByIdEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/subscriptions/Id/bngjsrfdtlkhugrdgflgiu`,
            method: 'GET',
            includes: 'subscriptions/Id/bngjsrfdtlkhugrdgflgiu',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: '*Sensitive Data',
                    filter: '{"scope": ["hidden"], "project": ["hidden"], "split_rule": true}',
                    policyid: 0,
                    last_processed: 'Mon, 31 Jul 2023 07:33:29 UTC',
                    account: 'ddmadmin',
                    comments: 'Sensitive data description has been omitted for privacy reasons.',
                    expired_at: null,
                    updated_at: 'Mon, 31 Jul 2023 07:33:29 UTC',
                    id: 'bccaabb5877a443abd6c56f3271557df',
                    replication_rules:
                        '[{"activity": "Hidden Activity", "rse_expression": "hidden=1&restricted=true", "source_replica_expression": "hidden-replica", "copies": "*", "lifetime": 172800, "comments": "Hidden activity description has been omitted for privacy reasons."}]',
                    state: 'UPDATED',
                    lifetime: 'Sun, 25 May 2042 15:41:54 UTC',
                    retroactive: false,
                    created_at: 'Wed, 21 May 2014 08:40:15 UTC',
                }),
            },
        };

        const subscriptionStream = Readable.from(
            [
                JSON.stringify({
                    id: 'c674f72385a14dc8bb5ceba3e491da5a',
                    name: 'wguan test weight',
                    filter: '{"scope": ["tests"]}',
                    replication_rules: '[{"rse_expression": "INFN-T1_SCRATCHDISK|IN2P3-CC_SCRATCHDISK", "copies": 1, "weight": "stresstestweight"}]',
                    policyid: 0,
                    state: 'INACTIVE',
                    last_processed: 'Thu, 17 Jul 2014 07:21:03 UTC',
                    account: 'ddmadmin',
                    lifetime: 'Tue, 01 May 2288 07:21:03 UTC',
                    comments: null,
                    retroactive: false,
                    expired_at: null,
                    created_at: 'Thu, 17 Jul 2014 07:21:04 UTC',
                    updated_at: 'Thu, 17 Jul 2014 07:21:04 UTC',
                }),
                JSON.stringify({
                    id: 'f8fb1e9b69e842daa0e1a29914114593',
                    name: 'Functional test T2',
                    filter: '{"project": ["step14"], "scope": ["tests"], "split_rule": true, "transient": ["None", "0"]}',
                    replication_rules:
                        '[{"lifetime": 172800, "activity": "Functional Test", "copies": 20, "source_replica_expression": "tier=1\\\\site=CERN-PROD", "rse_expression": "(tier=2&type=DATADISK\\\\ruciotestsite=true)\\\\todecommission=true"}]',
                    policyid: 0,
                    state: 'INACTIVE',
                    last_processed: 'Thu, 19 May 2022 11:46:11 UTC',
                    account: 'ddmadmin',
                    lifetime: 'Sun, 25 May 2042 15:58:21 UTC',
                    comments: 'Functional tests from T1 to T2',
                    retroactive: false,
                    expired_at: null,
                    created_at: 'Mon, 21 Jul 2014 12:18:39 UTC',
                    updated_at: 'Thu, 19 May 2022 11:46:13 UTC',
                }),
                JSON.stringify({
                    id: '6171d1b00b424e41a3c5c73c4cdb20b5',
                    name: 'T0 AOD to nucleus',
                    filter: '{"scope": ["data15_13TeV", "data15_5TeV", "data15_900GeV", "data15_comm", "data15_cos", "data15_hi", "data16_13TeV", "data16_14TeV", "data16_comm", "data16_cos", "data16_hip5TeV", "data16_hip8TeV", "data17_13TeV", "data17_5TeV", "data17_900GeV", "data17_comm", "data17_cos", "data17_hi", "data18_13TeV", "data18_1beam", "data18_1p8TeV", "data18_900GeV", "data18_calib", "data18_comm", "data18_cos", "data18_hi", "data22_13p6TeV", "data22_900GeV", "data22_comm", "data22_cos", "data22_hi", "data22_idcomm"], "datatype": ["AOD"], "transient": ["None", "0"], "prod_step": ["merge"], "did_type": ["DATASET"], "split_rule": true}',
                    replication_rules:
                        '[{"copies": 1, "rse_expression": "type=DATADISK&datapolicynucleus=true", "activity": "T0 Export", "weight": "mouweight"}]',
                    policyid: 3,
                    state: 'INACTIVE',
                    last_processed: 'Thu, 28 Jul 2022 09:11:28 UTC',
                    account: 'ddmadmin',
                    lifetime: 'Wed, 27 Jul 2022 09:11:49 UTC',
                    comments: 'T0 AOD to nucleus (permanent)',
                    retroactive: false,
                    expired_at: 'Thu, 28 Jul 2022 09:12:07 UTC',
                    created_at: 'Fri, 29 May 2015 12:01:44 UTC',
                    updated_at: 'Thu, 28 Jul 2022 09:12:07 UTC',
                }),
            ].join('\n'),
        );

        const listSubscriptionsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/subscriptions/ddmadmin`,
            method: 'GET',
            endsWith: 'subscriptions/ddmadmin',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: subscriptionStream,
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [getSubscriptionEndpoint, getSubscriptionByIdEndpoint, listSubscriptionsEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should fetch a subscription', async () => {
        const subscriptionGateway: SubscriptionGatewayOutputPort = appContainer.get<SubscriptionGatewayOutputPort>(GATEWAYS.SUBSCRIPTION);
        const subscription = await subscriptionGateway.get(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'ddmadmin', '*Functional Test');
        expect(subscription.id).toEqual('bccaabb5877a443abd6c56f3271557df');
        expect(subscription.errorName).toEqual('*Functional Test');
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

    it('should stream subscriptions', async () => {
        const rucioToken: string = MockRucioServerFactory.VALID_RUCIO_TOKEN;
        const subscriptionGateway: SubscriptionGatewayOutputPort = appContainer.get<SubscriptionGatewayOutputPort>(GATEWAYS.SUBSCRIPTION);
        const listSubscriptionsDTO: ListSubscriptionsDTO = await subscriptionGateway.list(rucioToken, 'ddmadmin');
        expect(listSubscriptionsDTO.status).toEqual('success');
        expect(listSubscriptionsDTO.stream).toBeDefined();

        const subscriptionStream = listSubscriptionsDTO.stream;

        if (subscriptionStream == null || subscriptionStream == undefined) {
            fail('Subscription stream is null or undefined');
        }

        const receivedData: SubscriptionDTO[] = [];

        const onData = (data: SubscriptionDTO) => {
            receivedData.push(data);
        };

        await new Promise((resolve, reject) => {
            subscriptionStream.on('data', onData);
            subscriptionStream.on('end', resolve);
            subscriptionStream.on('error', reject);
        });

        expect(receivedData.length).toEqual(3);
        expect(receivedData[0].id).toEqual('c674f72385a14dc8bb5ceba3e491da5a');
        expect(receivedData[0].replication_rules.length).toEqual(1);
    });

    it('Should list a subscription by Id', async () => {
        const subscriptionGateway: SubscriptionGatewayOutputPort = appContainer.get<SubscriptionGatewayOutputPort>(GATEWAYS.SUBSCRIPTION);
        const subscription = await subscriptionGateway.getById(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'bngjsrfdtlkhugrdgflgiu');
        expect(subscription.id).toEqual('bccaabb5877a443abd6c56f3271557df');
        expect(subscription.name).toEqual('*Sensitive Data');
        expect(subscription.state).toEqual(SubscriptionState.UPDATED);
        expect(subscription.account).toEqual('ddmadmin');
    });
});
