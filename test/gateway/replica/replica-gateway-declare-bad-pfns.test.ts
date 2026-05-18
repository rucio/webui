import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { DeclareBadPFNsDTO } from '@/lib/core/dto/replica-dto';

describe('Replica Gateway: Declare Bad PFNs', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const declareBadPFNsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/bad/pfns/`,
            method: 'POST',
            includes: 'replicas/bad/pfns',
            response: {
                status: 201,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: 'Created',
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [declareBadPFNsEndpoint]);
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('should successfully declare bad PFNs', async () => {
        const rucioReplicaGateway: ReplicaGatewayOutputPort = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);
        const dto: DeclareBadPFNsDTO = await rucioReplicaGateway.declareBadPFNs(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            ['root://xrd1:1094//rucio/test/80/25/file1'],
            'corrupted file',
            'BAD',
        );
        expect(dto.status).toBe('success');
        expect(dto.created).toBe(true);
    });

    it('should fail with an auth error', async () => {
        const rucioReplicaGateway: ReplicaGatewayOutputPort = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);
        const dto: DeclareBadPFNsDTO = await rucioReplicaGateway.declareBadPFNs(
            'invalid-token',
            ['root://xrd1:1094//rucio/test/80/25/file1'],
            'corrupted file',
            'BAD',
        );
        expect(dto.status).toBe('error');
        expect(dto.errorCode).toBe(401);
    });
});
