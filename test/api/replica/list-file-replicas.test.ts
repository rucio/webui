import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import { ListFileReplicasRequest } from '@/lib/core/usecase-models/list-file-replicas-usecase-models';
import { ListFileReplicasControllerParameters } from '@/lib/infrastructure/controller/list-file-replicas-controller';
import { ReplicaState } from '@/lib/core/entity/rucio';

describe('List File Replicas Feature tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const listFileReplicasEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/list`,
            method: 'POST',
            includes: 'replicas/list',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(
                    [
                        JSON.stringify({
                            scope: 'test',
                            name: 'file1',
                            rses: {
                                XRD3: ['root://xrd3:1096//rucio/test/80/25/file1'],
                                XRD1: ['root://xrd1:1094//rucio/test/80/25/file1'],
                            },
                            states: {
                                XRD3: 'COPYING',
                                XRD1: 'AVAILABLE',
                            },
                        }),
                    ].join('\n'),
                ),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [listFileReplicasEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should list File replicase for given FILE DID', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const listFileReplicasController = appContainer.get<BaseController<ListFileReplicasControllerParameters, ListFileReplicasRequest>>(
            CONTROLLERS.LIST_FILE_REPLICAS,
        );
        const listFileReplicasControllerParams: ListFileReplicasControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            name: 'file1',
            scope: 'test',
        };

        await listFileReplicasController.execute(listFileReplicasControllerParams);

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
            rse: 'XRD3',
            state: ReplicaState.COPYING,
        });

        expect(receivedData[1]).toEqual({
            status: 'success',
            rse: 'XRD1',
            state: ReplicaState.AVAILABLE,
        });
    });
});
