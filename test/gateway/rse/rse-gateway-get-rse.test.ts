import { ListRSEsDTO, RSEDTO } from '@/lib/core/dto/rse-dto';
import { RSEType } from '@/lib/core/entity/rucio';
import RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('RSEGateway Get', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const rse = {
            id: 'abcd',
            rse: 'DINGDONGRSE',
            rse_type: 'DISK',
            volatile: false,
            deterministic: true,
            staging_area: false,
        };

        const listRSEsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/DINGDONGRSE`,
            method: 'GET',
            includes: 'rses',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rse),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listRSEsEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should fetch a single RSE', async () => {
        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE);
        const getRSEDTO: RSEDTO = await rseGateway.getRSE(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'DINGDONGRSE');
        expect(getRSEDTO.status).toEqual('success');
        expect(getRSEDTO.id).toEqual('abcd');
        expect(getRSEDTO.name).toEqual('DINGDONGRSE');
        expect(getRSEDTO.rse_type).toEqual(RSEType.DISK);
        expect(getRSEDTO.volatile).toEqual(false);
    });
});
