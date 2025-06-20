import SubscriptionGatewayOutputPort from '@/lib/core/port/secondary/subscription-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import { BaseStreamableDTO } from '@/lib/sdk/dto';
import { SubscriptionRuleStateDTO } from '@/lib/core/dto/subscription-dto';

describe('Get Subscription Rule States', () => {
    beforeEach(() => {
        fetchMock.doMock();
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
                    ].join('\n'),
                ),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [getSubscriptionRuleStatesEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should fetch subscription rule states', async () => {
        const subscriptionGateway: SubscriptionGatewayOutputPort = appContainer.get<SubscriptionGatewayOutputPort>(GATEWAYS.SUBSCRIPTION);
        const listSubscriptionRuleStatesDTO: BaseStreamableDTO = await subscriptionGateway.listSubscriptionRuleStates(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'ddmadmin',
        );
        expect(listSubscriptionRuleStatesDTO.status).toEqual('success');

        const subscriptionRuleStatesStream = listSubscriptionRuleStatesDTO.stream;

        if (subscriptionRuleStatesStream == null || subscriptionRuleStatesStream == undefined) {
            fail('Subscription Rule States stream is null or undefined');
        }

        const receivedData: SubscriptionRuleStateDTO[] = [];

        const onData = (data: SubscriptionRuleStateDTO) => {
            receivedData.push(data);
        };

        await new Promise((resolve, reject) => {
            subscriptionRuleStatesStream.on('data', onData);
            subscriptionRuleStatesStream.on('end', resolve);
            subscriptionRuleStatesStream.on('error', reject);
        });

        expect(receivedData.length).toEqual(4);
        expect(receivedData).toEqual([
            {
                status: 'success',
                account: 'ddmadmin',
                subscriptionName: 'EVNT to T0 with 1 year lifetime',
                state: 'OK',
                count: 15464,
            },
            {
                status: 'success',
                account: 'ddmadmin',
                subscriptionName: 'group.phys-gener to CERN-PROD_PHYS-GENER',
                state: 'OK',
                count: 5344,
            },
            {
                status: 'success',
                account: 'ddmadmin',
                subscriptionName: '*Functional Test',
                state: 'OK',
                count: 95918,
            },
            {
                status: 'success',
                account: 'ddmadmin',
                subscriptionName: 'T0 DESD to T1 tape',
                state: 'OK',
                count: 2382,
            },
        ]);
    });
    it('tests_merge_of_2_objects', () => {
        const obj1 = {
            status: 'success',
            states_ok: 1,
        };
        const obj2 = {
            status: 'success',
            states_replicating: 2,
        };
        const mergedObj = {
            ...obj1,
            ...obj2,
        };
        expect(mergedObj).toEqual({
            status: 'success',
            states_ok: 1,
            states_replicating: 2,
        });
    });
});
