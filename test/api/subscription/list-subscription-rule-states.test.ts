import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { BaseController } from '@/lib/sdk/controller';
import { ListSubscriptionRuleStatesControllerParameters } from '@/lib/infrastructure/controller/list-subscription-rule-states-controller';
import { ListSubscriptionRuleStatesRequest } from '@/lib/core/usecase-models/list-subscription-rule-states-usecase-models';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { NextApiResponse } from 'next';
import { generateEmptySubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { SubscriptionState } from '@/lib/core/entity/rucio';

describe('Get Subscription Rule States', () => {
    beforeEach(() => {
        fetchMock.doMock();

        const makeSubscription = (name: string) =>
            JSON.stringify({
                id: `mock-id-${name}`,
                name,
                filter: '{}',
                replication_rules: '[]',
                policyid: 0,
                state: 'A',
                last_processed: 'Thu, 01 Jan 2026 00:00:00 UTC',
                account: 'ddmadmin',
                lifetime: 'Thu, 01 Jan 2099 00:00:00 UTC',
                comments: null,
                retroactive: false,
                expired_at: null,
                created_at: 'Thu, 01 Jan 2026 00:00:00 UTC',
                updated_at: 'Thu, 01 Jan 2026 00:00:00 UTC',
            });

        const getSubscriptionsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/subscriptions/ddmadmin`,
            method: 'GET',
            endsWith: '/subscriptions/ddmadmin',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(
                    [
                        makeSubscription('EVNT to T0 with 1 year lifetime'),
                        makeSubscription('group.phys-gener to CERN-PROD_PHYS-GENER'),
                        makeSubscription('*Functional Test'),
                        makeSubscription('T0 DESD to T1 tape'),
                    ].join('\n'),
                ),
            },
        };

        const getSubscriptionRuleStatesEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/subscriptions/ddmadmin/rules/states`,
            method: 'GET',
            includes: '/Rules/States',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(
                    [
                        JSON.stringify(['ddmadmin', 'EVNT to T0 with 1 year lifetime', 'OK', 15464]),
                        JSON.stringify(['ddmadmin', 'group.phys-gener to CERN-PROD_PHYS-GENER', 'OK', 5344]),
                        JSON.stringify(['ddmadmin', '*Functional Test', 'OK', 95918]),
                        JSON.stringify(['ddmadmin', 'T0 DESD to T1 tape', 'OK', 2382]),
                        JSON.stringify(['ddmadmin', 'T0 DESD to T1 tape', 'STUCK', 500]),
                    ].join('\n'),
                ),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [getSubscriptionsEndpoint, getSubscriptionRuleStatesEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    test('should return a list of subscription rule states', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const listSubscriptionRuleStatesController = appContainer.get<
            BaseController<ListSubscriptionRuleStatesControllerParameters, ListSubscriptionRuleStatesRequest>
        >(CONTROLLERS.LIST_SUBSCRIPTION_RULE_STATES);
        const listSubscriptionRuleStatesControllerParams: ListSubscriptionRuleStatesControllerParameters = {
            account: 'ddmadmin',
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        };

        await listSubscriptionRuleStatesController.execute(listSubscriptionRuleStatesControllerParams);

        const receivedData: any[] = [];
        const onData = (data: any) => {
            receivedData.push(JSON.parse(data));
        };

        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData);
            res.on('end', () => {
                res.off('data', onData);
                resolve();
            });
            res.on('error', err => {
                res.off('data', onData);
                reject(err);
            });
        });

        await done;
        expect(receivedData).toEqual([
            {
                ...generateEmptySubscriptionRuleStatesViewModel(),
                status: 'success',
                name: 'EVNT to T0 with 1 year lifetime',
                subscriptionState: SubscriptionState.ACTIVE,
                state_ok: 15464,
            },
            {
                ...generateEmptySubscriptionRuleStatesViewModel(),
                status: 'success',
                name: 'group.phys-gener to CERN-PROD_PHYS-GENER',
                subscriptionState: SubscriptionState.ACTIVE,
                state_ok: 5344,
            },
            {
                ...generateEmptySubscriptionRuleStatesViewModel(),
                status: 'success',
                name: '*Functional Test',
                subscriptionState: SubscriptionState.ACTIVE,
                state_ok: 95918,
            },
            {
                ...generateEmptySubscriptionRuleStatesViewModel(),
                status: 'success',
                name: 'T0 DESD to T1 tape',
                subscriptionState: SubscriptionState.ACTIVE,
                state_ok: 2382,
                state_stuck: 500,
            },
        ]);
    });
});
