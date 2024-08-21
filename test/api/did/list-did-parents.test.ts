import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import { ListDIDParentsControllerParameters } from '@/lib/infrastructure/controller/list-did-parents-controller';
import { ListDIDParentsRequest } from '@/lib/core/usecase-models/list-did-parents-usecase-models';
import { DIDType } from '@/lib/core/entity/rucio';

describe('List DID Parents Feature tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didListParentsMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/file1/parents`,
            method: 'GET',
            includes: 'test/file1/parents',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(
                    [
                        JSON.stringify({
                            scope: 'test',
                            name: 'dataset1',
                            type: 'DATASET',
                        }),
                        JSON.stringify({
                            scope: 'test',
                            name: 'dataset2',
                            type: 'DATASET',
                        }),
                    ].join('\n'),
                ),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [didListParentsMockEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should list DID parents', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const listDIDParentsController = appContainer.get<BaseController<ListDIDParentsControllerParameters, ListDIDParentsRequest>>(
            CONTROLLERS.LIST_DID_PARENTS,
        );
        const listDIDParentsControllerParams: ListDIDParentsControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            name: 'file1',
            scope: 'test',
        };

        await listDIDParentsController.execute(listDIDParentsControllerParams);

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
        console.log(receivedData);
        expect(receivedData.length).toBe(2);
        expect(receivedData[0]).toEqual({
            status: 'success',
            scope: 'test',
            name: 'dataset1',
            did_type: DIDType.DATASET,
        });
        expect(receivedData[1]).toEqual({
            status: 'success',
            scope: 'test',
            name: 'dataset2',
            did_type: DIDType.DATASET,
        });
    });
});
