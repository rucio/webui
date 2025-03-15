import { BaseController } from '@/lib/sdk/controller';
import { ListDIDsRequest } from '@/lib/core/usecase-models/list-dids-usecase-models';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller';
import { NextApiResponse } from 'next';
import { Readable } from 'stream';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { DIDLong, DIDType } from '@/lib/core/entity/rucio';
import { collectStreamedData } from '@/lib/sdk/utils';

describe('DID API Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should successfully stream DIDs', async () => {
        const dids: string[] = ['"dataset1"', '"dataset2"', '"dataset3"'];

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

        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const listDIDsController = appContainer.get<BaseController<ListDIDsControllerParameters, ListDIDsRequest>>(CONTROLLERS.LIST_DIDS);
        const controllerParams: ListDIDsControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            query: 'test:dataset1',
            type: 'dataset',
        };
        await listDIDsController.execute(controllerParams);

        const receivedData: string[] = await collectStreamedData(res);

        expect(receivedData.map(rawData => JSON.parse(rawData))).toEqual([
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
