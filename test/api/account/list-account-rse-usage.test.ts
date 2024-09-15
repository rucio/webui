import MockRucioServerFactory, { MockEndpoint } from '../../fixtures/rucio-server';
import { Readable } from 'stream';
import { MockHttpStreamableResponseFactory } from '../../fixtures/http-fixtures';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { BaseController } from '@/lib/sdk/controller';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { NextApiResponse } from 'next';
import { ListAccountRSEUsageControllerParameters } from '@/lib/infrastructure/controller/list-account-rse-usage-controller';
import { ListAccountRSEUsageRequest } from '@/lib/core/usecase-models/list-account-rse-usage-usecase-models';

describe('Feature: ListAccountRSEUsage', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const accountUsageEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/tester/usage`,
            method: 'GET',
            includes: 'accounts/tester/usage',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: Readable.from(
                    [
                        JSON.stringify({
                            rse_id: '55a218820c3c4089a1eb74e299de40de',
                            rse: 'XRD3',
                            bytes: 0,
                            files: 0,
                            bytes_limit: 10000,
                            bytes_remaining: 10000,
                        }),
                        JSON.stringify({
                            rse_id: '55a218820c3c4089a1eb74e299de40de',
                            rse: 'XRD1',
                            bytes: 20,
                            files: 1,
                            bytes_limit: 30,
                            bytes_remaining: 10,
                        }),
                    ].join('\n'),
                ),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [accountUsageEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should return a view model for a valid request to ListAccountRSEUsage feature', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const controller = appContainer.get<BaseController<ListAccountRSEUsageControllerParameters, ListAccountRSEUsageRequest>>(
            CONTROLLERS.LIST_ACCOUNT_RSE_USAGE,
        );
        const params: ListAccountRSEUsageControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            account: 'tester',
        };

        await controller.execute(params);

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
        expect(receivedData.length).toEqual(2);
        expect(receivedData[0].status).toEqual('success');
        expect(receivedData[0].rse).toEqual('XRD3');
        expect(receivedData[1].used_bytes).toEqual(20);
    });
});
