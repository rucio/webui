import { BaseController } from '@/lib/sdk/controller';
import { ListDIDsRequest } from '@/lib/core/usecase-models/list-dids-usecase-models';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller';
import { NextApiResponse } from 'next';
import { Readable } from 'stream';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('DID API Tests #2', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const dids: string[] = ['"dataset1"', '"dataset2"', 'error', '"dataset3"'];

        const listDIDsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dids/search`,
            method: 'GET',
            includes: 'test/dids/search',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(dids.join('\n')),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listDIDsEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should successfully stream DIDs when an error is present in the chunks', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const listDIDsController = appContainer.get<BaseController<ListDIDsControllerParameters, ListDIDsRequest>>(CONTROLLERS.LIST_DIDS);
        const controllerParams: ListDIDsControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            query: 'test:dataset1',
            type: 'dataset',
        };
        await listDIDsController.execute(controllerParams);

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
                status: 'success',
                name: 'dataset1',
                scope: 'test',
            },
            {
                status: 'success',
                name: 'dataset2',
                scope: 'test',
            },
            {
                status: 'success',
                name: 'dataset3',
                scope: 'test',
            },
        ]);
    });
});
