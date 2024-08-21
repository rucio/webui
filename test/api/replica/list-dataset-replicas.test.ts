import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import ListDatasetReplicasController, {
    ListDatasetReplicasControllerParameters,
} from '@/lib/infrastructure/controller/list-dataset-replicas-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { BaseController } from '@/lib/sdk/controller';
import { ListDatasetReplicasRequest } from '@/lib/core/usecase-models/list-dataset-replicas-usecase-models';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import { NextApiResponse } from 'next';
import { DIDDatasetReplicasViewModel } from '@/lib/infrastructure/data/view-model/did';

describe('List Dataset Replicas Feature Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const listDatasetReplicasEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/test/dataset1/datasets`,
            method: 'GET',
            includes: 'replicas/test/dataset1/datasets',
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
                            rse: 'XRD3',
                            rse_id: '28e77f4f2c864f7d949eb602d6f05985',
                            bytes: 0,
                            length: 0,
                            available_bytes: 1000,
                            available_length: 10,
                            state: 'UNAVAILABLE',
                            created_at: 'Tue, 12 Sep 2023 09:12:11 UTC',
                            updated_at: 'Tue, 12 Sep 2023 09:12:11 UTC',
                            accessed_at: null,
                        }),
                    ].join('\n'),
                ),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [listDatasetReplicasEndpoint]);
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('should successfully stream a list of dataset replicas view models', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const listDatasetReplicasController: ListDatasetReplicasController = appContainer.get(CONTROLLERS.LIST_DATASET_REPLICAS);

        const controllerParameters: ListDatasetReplicasControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            scope: 'test',
            name: 'dataset1',
        };
        await listDatasetReplicasController.execute(controllerParameters);
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
        expect(receivedData.length).toBe(1);
        expect(receivedData[0]).toEqual({
            status: 'success',
            rseblocked: 0,
            rse: 'XRD3',
            availability: false,
            available_files: 10,
            available_bytes: 1000,
            creation_date: 'Tue, 12 Sep 2023 09:12:11 UTC',
            last_accessed: '',
        } as DIDDatasetReplicasViewModel);
    });
});
