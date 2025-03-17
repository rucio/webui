import { BaseController } from '@/lib/sdk/controller';
import { ListDIDsRequest } from '@/lib/core/usecase-models/list-dids-usecase-models';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller';
import { NextApiResponse } from 'next';
import { Readable } from 'stream';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import fetchMock from 'jest-fetch-mock';

describe('DID API Tests - ListDIDsFull', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should successfully stream fully populated DIDs', async () => {
        // Mock the new endpoint that returns fully populated DIDs
        const listDIDsFullEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dids/list`,
            method: 'GET',
            includes: 'test/dids/list',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from([
                    JSON.stringify({
                        scope: 'test',
                        name: 'dataset1',
                        type: 'DATASET',
                        account: 'root',
                        open: true,
                        monotonic: false,
                        expired_at: null,
                        length: 10,
                        bytes: 1024,
                    }) + '\n',
                    JSON.stringify({
                        scope: 'test',
                        name: 'dataset2',
                        type: 'DATASET',
                        account: 'root',
                        open: false,
                        monotonic: true,
                        expired_at: null,
                        bytes: 2048,
                        length: 20,
                    }) + '\n',
                    JSON.stringify({
                        scope: 'test',
                        name: 'dataset3',
                        type: 'DATASET',
                        account: 'root',
                        open: true,
                        monotonic: false,
                        expired_at: null,
                        bytes: 4096,
                        length: 30,
                    }) + '\n',
                ].join('')),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listDIDsFullEndpoint]);

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

        expect(receivedData.length).toEqual(3);
        expect(receivedData).toEqual([
            {
                status: 'success',
                name: 'dataset1',
                scope: 'test',
                did_type: 'Dataset',
                bytes: 1024,
                length: 10,
                open: true,
            },
            {
                status: 'success',
                name: 'dataset2',
                scope: 'test',
                did_type: 'Dataset',
                bytes: 2048,
                length: 20,
                open: false,
            },
            {
                status: 'success',
                name: 'dataset3',
                scope: 'test',
                did_type: 'Dataset',
                bytes: 4096,
                length: 30,
                open: true,
            },
        ]);
    });

    it('Should handle errors from the server', async () => {
        // Mock the new endpoint with an error response
        const listDIDsFullEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dids/list`,
            method: 'GET',
            includes: 'test/dids/list',
            response: {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ExceptionClass: 'DataIdentifierNotFound',
                    ExceptionMessage: 'Data identifier not found',
                }),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listDIDsFullEndpoint]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const listDIDsController = appContainer.get<BaseController<ListDIDsControllerParameters, ListDIDsRequest>>(CONTROLLERS.LIST_DIDS);
        const controllerParams: ListDIDsControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            query: 'test:nonexistent',
            type: 'dataset',
        };
        await listDIDsController.execute(controllerParams);

        expect(res.statusCode).toEqual(404);
    });
}); 