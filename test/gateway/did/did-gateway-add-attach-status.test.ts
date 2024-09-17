import { AttachDIDDTO, CreateDIDSampleDTO, SetDIDStatusDTO } from '@/lib/core/dto/did-dto';
import { DIDType } from '@/lib/core/entity/rucio';
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('DID Gateway Tests: Add DID, Attach DIDs, Set DIDStatus', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const addDIDEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/conatiner10`,
            endsWith: '/test/container10',
            method: 'POST',
            requestValidator: async (req: Request) => {
                const body = await req.json();
                return body.type === 'CONTAINER';
            },
            response: {
                status: 201,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: 'Created',
            },
        };
        const attachDIDEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset10/dids`,
            endsWith: '/test/dataset10/dids',
            method: 'POST',
            response: {
                status: 201,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: 'Created',
            },
        };

        const setStatusEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset10/status`,
            endsWith: '/test/dataset10/status',
            method: 'PUT',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                body: null,
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [addDIDEndpoint, attachDIDEndpoint, setStatusEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should successfully hit the right Rucio Server endpoint when adding a new DID', async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const dto: CreateDIDSampleDTO = await rucioDIDGateway.addDID(
            MockRucioServerFactory.VALID_RUCIO_TOKEN,
            'test',
            'container10',
            DIDType.CONTAINER,
        );
        expect(dto.status).toEqual('success');
        expect(dto.created).toEqual(true);
    });
    it('should successfully hit the right Rucio Server endpoint when attaching DIDs to a new DID', async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const dto: AttachDIDDTO = await rucioDIDGateway.attachDIDs(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'dataset10', [
            {
                scope: 'test',
                name: 'file1',
                did_type: DIDType.FILE,
            },
            {
                scope: 'test',
                name: 'file2',
                did_type: DIDType.FILE,
            },
        ]);
        expect(dto.status).toEqual('success');
        expect(dto.created).toEqual(true);
    });
    it('should successfully hit the right Rucio Server endpoint when setting the status of a DID', async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const dto: SetDIDStatusDTO = await rucioDIDGateway.setDIDStatus(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'dataset10', false);
        expect(dto.status).toEqual('success');
    });
});
