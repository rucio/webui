import { ListDIDDTO } from '@/lib/core/dto/did-dto';
import { DIDType } from '@/lib/core/entity/rucio';
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { Readable } from 'stream';

const VALID_TOKEN = 'rucio-ddmlab-askdjljioj';

describe('ListDIDsEndpoint type guard', () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, () =>
            Promise.resolve({
                status: 200,
                headers: { 'Content-Type': 'application/x-json-stream' },
                body: Readable.from(['"dataset1"\n']) as any,
            }),
        );
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('refuses DIDType.ALL, which the usecase resolves into concrete per-hop types', async () => {
        const didGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);

        const dto: ListDIDDTO = await didGateway.listDIDs(VALID_TOKEN, 'test', 'dataset1', DIDType.ALL);

        expect(dto.status).toEqual('error');
        expect(dto.errorMessage).toMatch(/ALL/);
    });

    it('accepts the concrete Rucio types', async () => {
        const didGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);

        for (const type of [DIDType.CONTAINER, DIDType.DATASET, DIDType.FILE]) {
            const dto: ListDIDDTO = await didGateway.listDIDs(VALID_TOKEN, 'test', 'dataset1', type);
            expect(dto.status).toEqual('success');
        }
    });
});
