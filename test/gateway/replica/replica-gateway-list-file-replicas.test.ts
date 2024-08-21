import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { ListReplicasDTO } from '@/lib/core/dto/replica-dto';
import { ReplicaState } from '@/lib/core/entity/rucio';

describe('Replica Gateway: List File Replicas', () => {
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
        fetchMock.resetMocks();
    });

    it('should successfully stream a list of file replicas', async () => {
        const rucioReplicaGateway: ReplicaGatewayOutputPort = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);
        const dto: ListReplicasDTO = await rucioReplicaGateway.listFileReplicas(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'file1');
        expect(dto.status).toBe('success');

        const fileReplicasStream = dto.stream;
        expect(fileReplicasStream).toBeDefined();

        if (fileReplicasStream == null || fileReplicasStream == undefined) {
            fail('fileReplicasStream is null or undefined');
        }

        const receivedData: any[] = [];
        const onData = (data: any) => {
            receivedData.push(data);
        };

        await new Promise((resolve, reject) => {
            fileReplicasStream.on('data', onData);
            fileReplicasStream.on('end', resolve);
            fileReplicasStream.on('error', reject);
        });

        expect(receivedData.length).toBe(2);
        expect(receivedData).toEqual([
            {
                status: 'success',
                rse: 'XRD3',
                state: ReplicaState.COPYING,
            },
            {
                status: 'success',
                rse: 'XRD1',
                state: ReplicaState.AVAILABLE,
            },
        ]);
    });
});
