import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { DeclareBadReplicasDTO } from '@/lib/core/dto/replica-dto';

const endpointBuilder = (status: number, body: unknown): MockEndpoint => ({
    url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/bad/dids/`,
    method: 'POST',
    includes: 'replicas/bad/dids',
    response: {
        status,
        headers: { 'Content-Type': 'application/json' },
        body: typeof body === 'string' ? body : JSON.stringify(body),
    },
});

describe('Replica Gateway: Declare Bad Replicas', () => {
    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('returns success with an empty notDeclared list when Rucio accepts every DID', async () => {
        fetchMock.doMock();
        MockRucioServerFactory.createMockRucioServer(true, [endpointBuilder(201, [])]);

        const gateway: ReplicaGatewayOutputPort = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);
        const dto: DeclareBadReplicasDTO = await gateway.declareBadReplicas(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            [{ scope: 'test', name: 'susp_1.dat' }],
            'MOCK_SUSPICIOUS',
            'checksum mismatch',
        );
        expect(dto.status).toBe('success');
        expect(dto.notDeclared).toEqual([]);
    });

    it('surfaces replicas that Rucio refused to mark bad', async () => {
        fetchMock.doMock();
        MockRucioServerFactory.createMockRucioServer(true, [
            endpointBuilder(201, [{ scope: 'test', name: 'susp_2.dat', rse: 'MOCK_SUSPICIOUS', reason: 'No such replica' }]),
        ]);

        const gateway: ReplicaGatewayOutputPort = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);
        const dto: DeclareBadReplicasDTO = await gateway.declareBadReplicas(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            [{ scope: 'test', name: 'susp_2.dat' }],
            'MOCK_SUSPICIOUS',
            'checksum mismatch',
        );
        expect(dto.status).toBe('success');
        expect(dto.notDeclared).toHaveLength(1);
        expect(dto.notDeclared[0]).toEqual({
            scope: 'test',
            name: 'susp_2.dat',
            rse: 'MOCK_SUSPICIOUS',
            reason: 'No such replica',
        });
    });

    it('returns an error DTO on auth failure', async () => {
        fetchMock.doMock();
        MockRucioServerFactory.createMockRucioServer(true, [endpointBuilder(201, [])]);

        const gateway: ReplicaGatewayOutputPort = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);
        const dto: DeclareBadReplicasDTO = await gateway.declareBadReplicas('invalid-token', [{ scope: 'test', name: 'x' }], 'MOCK', 'r');
        expect(dto.status).toBe('error');
        expect(dto.errorCode).toBe(401);
    });
});
