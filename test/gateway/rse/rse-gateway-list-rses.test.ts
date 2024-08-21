import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { ListRSEsDTO, RSEDTO } from '@/lib/core/dto/rse-dto';
import { collectStreamedData } from 'test/fixtures/stream-test-utils';
import { RSEType } from '@/lib/core/entity/rucio';

describe('RSEGateway', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const rseStream = Readable.from(
            [
                JSON.stringify({
                    id: 'ANONYMOUS_ID_1',
                    rse: 'ANONYMOUS_RSE_1',
                    vo: 'def',
                    rse_type: 'DISK',
                    deterministic: true,
                    volatile: false,
                    staging_area: false,
                    city: null,
                    region_code: null,
                    country_name: null,
                    continent: null,
                    time_zone: null,
                    ISP: null,
                    ASN: null,
                    longitude: null,
                    latitude: null,
                    availability: 7,
                    availability_read: true,
                    availability_write: true,
                    availability_delete: true,
                    qos_class: null,
                    deleted: false,
                    deleted_at: null,
                    created_at: 'Thu, 03 Aug 2023 11:37:48 UTC',
                    updated_at: 'Thu, 03 Aug 2023 11:37:48 UTC',
                }),
                JSON.stringify({
                    id: 'ANONYMOUS_ID_2',
                    rse: 'ANONYMOUS_RSE_2',
                    vo: 'def',
                    rse_type: 'DISK',
                    deterministic: true,
                    volatile: false,
                    staging_area: false,
                    city: null,
                    region_code: null,
                    country_name: null,
                    continent: null,
                    time_zone: null,
                    ISP: null,
                    ASN: null,
                    longitude: null,
                    latitude: null,
                    availability: 7,
                    availability_read: true,
                    availability_write: true,
                    availability_delete: true,
                    qos_class: null,
                    deleted: false,
                    deleted_at: null,
                    created_at: 'Thu, 03 Aug 2023 11:37:48 UTC',
                    updated_at: 'Thu, 03 Aug 2023 11:37:48 UTC',
                }),
                JSON.stringify({
                    id: 'ANONYMOUS_ID_3',
                    rse: 'ANONYMOUS_RSE_3',
                    vo: 'def',
                    rse_type: 'DISK',
                    deterministic: true,
                    volatile: false,
                    staging_area: false,
                    city: null,
                    region_code: null,
                    country_name: null,
                    continent: null,
                    time_zone: null,
                    ISP: null,
                    ASN: null,
                    longitude: null,
                    latitude: null,
                    availability: 7,
                    availability_read: true,
                    availability_write: true,
                    availability_delete: true,
                    qos_class: null,
                    deleted: false,
                    deleted_at: null,
                    created_at: 'Thu, 03 Aug 2023 11:37:48 UTC',
                    updated_at: 'Thu, 03 Aug 2023 11:37:48 UTC',
                }),
            ].join('\n'),
        );

        const listRSEsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses`,
            method: 'GET',
            includes: 'rses',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: rseStream,
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listRSEsEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it('Should fetch a list of RSEs', async () => {
        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE);
        const listRSEsDTO: ListRSEsDTO = await rseGateway.listRSEs(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'def');
        expect(listRSEsDTO.status).toEqual('success');

        const rseStream = listRSEsDTO.stream;
        if (rseStream == null || rseStream == undefined) {
            fail('RSE stream is null or undefined');
        }

        const recievedData: RSEDTO[] = await collectStreamedData<RSEDTO>(rseStream);
        expect(recievedData.length).toEqual(3);
        expect(recievedData[0].id).toEqual('ANONYMOUS_ID_1');
        expect(recievedData[0].name).toEqual('ANONYMOUS_RSE_1');
        expect(recievedData[0].rse_type).toEqual(RSEType.DISK);
    });
    it('Should fail with Auth Error without returning a stream', async () => {
        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE);
        const listRSEsDTO: ListRSEsDTO = await rseGateway.listRSEs('bad rucio auth token', 'def');
        expect(listRSEsDTO.status).toEqual('error');
        expect(listRSEsDTO.stream).toEqual(undefined);
        expect(listRSEsDTO.errorCode).toEqual(401);
        expect(listRSEsDTO.errorMessage).toEqual('The provided authentication token is invalid or has expired.');
    });
});
