import { ListDIDDTO } from '@/lib/core/dto/did-dto';
import { DIDLong, DIDType } from '@/lib/core/entity/rucio';
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { Readable } from 'stream';
import { TRucioExtendedDID } from '@/lib/infrastructure/gateway/did-gateway/did-gateway-utils';
import { collectStreamedData } from '@/lib/sdk/utils';

const getSearchData = (req: Request): string[] => {
    if (req.url.includes('extended=true')) {
        const data: TRucioExtendedDID[] = [
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
                type: 'Dataset',
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
            },
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01',
                type: 'Dataset',
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
            },
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02',
                type: 'Dataset',
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
            },
        ];
        return data.map(did => JSON.stringify(did));
    }
    if (req.url.includes('long=True')) {
        const data: DIDLong[] = [
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
                did_type: DIDType.DATASET,
                bytes: 42,
                length: 0,
            },
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01',
                did_type: DIDType.DATASET,
                bytes: 42,
                length: 0,
            },
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02',
                did_type: DIDType.DATASET,
                bytes: 42,
                length: 0,
            },
        ];
        return data.map(did => JSON.stringify(did));
    }
    return [
        '"00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00"',
        '"00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01"',
        '"00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02"',
    ];
};

describe('DID Gateway Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, req => {
            const rucioToken = req.headers.get('X-Rucio-Auth-Token');
            if (rucioToken !== 'rucio-ddmlab-askdjljioj') {
                return Promise.resolve({
                    status: 401,
                });
            }
            if (req.url.includes('/data17_13TeV/dids/search')) {
                const searchData = getSearchData(req);
                const stream = Readable.from(searchData.join('\n'));
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/x-json-stream',
                    },
                    body: stream,
                });
            }
            if (req.url.endsWith('/test/dataset1/status')) {
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        scope: 'test',
                        name: 'dataset1',
                        type: 'DATASET',
                        account: 'root',
                        open: true,
                        monotonic: false,
                        expired_at: null,
                        length: null,
                        bytes: null,
                    }),
                });
            }
        });
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should successfully stream DIDs from Newline-Delimitted String to String Array', async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const dto: ListDIDDTO = await rucioDIDGateway.listDIDs(
            'rucio-ddmlab-askdjljioj',
            'data17_13TeV',
            '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
            DIDType.DATASET,
        );
        expect(dto.status).toBe('success');
        expect(dto.stream).not.toBeUndefined();
        expect(dto.stream).not.toBeNull();
        const didStream = dto.stream;

        if (didStream === null || didStream === undefined) {
            fail('didStream is null or undefined');
        }

        const receivedData = await collectStreamedData(didStream);

        expect(receivedData).toEqual([
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
            },
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01',
            },
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02',
            },
        ]);
    });

    it('should successfully fetch DIDs with extended fields', async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const dto: ListDIDDTO = await rucioDIDGateway.listExtendedDIDs(
            'rucio-ddmlab-askdjljioj',
            'data17_13TeV',
            '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
            DIDType.DATASET,
        );
        expect(dto.status).toBe('success');
        expect(dto.stream).not.toBeUndefined();
        expect(dto.stream).not.toBeNull();
        const didStream = dto.stream;

        if (didStream === null || didStream === undefined) {
            fail('didStream is null or undefined');
        }

        const receivedData = await collectStreamedData(didStream);

        expect(receivedData).toEqual([
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
                did_type: DIDType.DATASET,
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
                md5: null,
                adler32: null,
            },
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01',
                did_type: DIDType.DATASET,
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
                md5: null,
                adler32: null,
            },
            {
                scope: 'data17_13TeV',
                name: '00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02',
                did_type: DIDType.DATASET,
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
                md5: null,
                adler32: null,
            },
        ]);
    });

    it("Should fetch DID's status", async () => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const didDTO = await rucioDIDGateway.getDID('rucio-ddmlab-askdjljioj', 'test', 'dataset1', undefined);
        expect(didDTO.status).toBe('success');
        expect(didDTO.account).toBe('root');
        expect(didDTO.open).toBe(true);
        expect(didDTO.monotonic).toBe(false);
        expect(didDTO.expired_at).toBeNull();
    });
});
