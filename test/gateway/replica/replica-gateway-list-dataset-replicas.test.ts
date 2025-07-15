import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { DatasetReplicasDTO, ListReplicasDTO } from '@/lib/core/dto/replica-dto';
import { ReplicaState } from '@/lib/core/entity/rucio';

describe('Replica Gateway: List Dataset Replicas', () => {
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
                            length: 20,
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

    it('should successfully stream a list of dataset replicas', async () => {
        const rucioReplicaGateway: ReplicaGatewayOutputPort = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);
        const dto: ListReplicasDTO = await rucioReplicaGateway.listDatasetReplicas(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'dataset1');
        expect(dto.status).toBe('success');

        const datasetReplicasStream = dto.stream;
        expect(datasetReplicasStream).toBeDefined();

        if (datasetReplicasStream == null || datasetReplicasStream == undefined) {
            fail('datasetReplicasStream is null or undefined');
        }

        const receivedData: any[] = [];
        const onData = (data: any) => {
            receivedData.push(data);
        };

        await new Promise((resolve, reject) => {
            datasetReplicasStream.on('data', onData);
            datasetReplicasStream.on('end', resolve);
            datasetReplicasStream.on('error', reject);
        });

        expect(receivedData.length).toBe(1);
        expect(receivedData).toEqual([
            {
                status: 'success',
                rse: 'XRD3',
                availability: false,
                available_files: 10,
                available_bytes: 1000,
                length: 20,
                creation_date: 'Tue, 12 Sep 2023 09:12:11 UTC',
                last_accessed: '',
            } as DatasetReplicasDTO,
        ]);
    });
});
