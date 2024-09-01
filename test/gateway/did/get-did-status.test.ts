import { DIDExtendedDTO } from '@/lib/core/dto/did-dto';
import { DIDType } from '@/lib/core/entity/rucio';
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('DID Gateway Tests Get STATUS', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const getDIDStatusEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/container/status?dynamic_depth=FILE`,
            method: 'GET',
            endsWith: '/status?dynamic_depth=FILE',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scope: 'test',
                    name: 'container',
                    type: 'CONTAINER',
                    account: 'root',
                    open: true,
                    monotonic: false,
                    expired_at: null,
                    length: 4,
                    bytes: 41943040.0,
                }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [getDIDStatusEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should successfully get status of a DID', async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const dto: DIDExtendedDTO = await rucioDIDGateway.getDID(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'container', DIDType.FILE);
        expect(dto).toEqual({
            status: 'success',
            scope: 'test',
            name: 'container',
            did_type: DIDType.CONTAINER,
            account: 'root',
            open: true,
            monotonic: false,
            expired_at: null,
            length: 4,
            bytes: 41943040.0,
        });
    });
});
