import { SubscriptionState } from '@/lib/core/entity/rucio';
import GetSubscriptionByIdController, {
    GetSubscriptionByIdControllerParameters,
} from '@/lib/infrastructure/controller/get-subscription-by-id-controller';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { createHttpMocks } from '@/test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from '@/test/fixtures/rucio-server';
import { NextApiResponse } from 'next';

describe('Get Subscription By Id Feature Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const getSubscriptionByIdEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/subscriptions/id/bccaabb5877a443abd6c56f3271557df`,
            method: 'GET',
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
        MockRucioServerFactory.createMockRucioServer(true, [getSubscriptionByIdEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should get subscription by its id', async () => {
        const { req, res, session } = await createHttpMocks('api/feature/get-subscription-by-id/bccaabb5877a443abd6c56f3271557df', 'GET', {});

        const getSubscriptionByIdController: GetSubscriptionByIdController = appContainer.get(CONTROLLERS.GET_SUBSCRIPTION_BY_ID);
        const getSubscriptionByIdControllerParams: GetSubscriptionByIdControllerParameters = {
            id: 'bccaabb5877a443abd6c56f3271557df',
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        };

        await getSubscriptionByIdController.execute(getSubscriptionByIdControllerParams);
        expect(res._getStatusCode()).toBe(200);
        const subscription: SubscriptionViewModel = JSON.parse(res._getData());
        expect(subscription.status).toBe('success');
        expect(subscription.id).toEqual('bccaabb5877a443abd6c56f3271557df');
        expect(subscription.name).toEqual('*Sensitive Data');
        expect(subscription.account).toEqual('ddmadmin');
        expect(subscription.state).toEqual(SubscriptionState.UPDATED);
        expect(subscription.lifetime).toEqual('Sun, 25 May 2042 15:41:54 UTC');
        expect(subscription.filter).toEqual('{"scope": ["hidden"], "project": ["hidden"], "split_rule": true}');
    });
});
