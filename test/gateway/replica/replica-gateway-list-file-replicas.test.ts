import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { Readable } from 'stream';
import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { FileReplicaStateDTO, ListFileReplicasOptions, ListReplicasDTO } from '@/lib/core/dto/replica-dto';
import { ReplicaState } from '@/lib/core/entity/rucio';

const FILE1_XRD1_PFN = 'root://xrd1:1094//rucio/test/80/25/file1';
const FILE1_XRD3_PFN = 'davs://xrd3:1096//rucio/test/80/25/file1';
const FILE2_ZIP_PFN = 'root://xrd2:1095//rucio/test/aa/bb/archive.zip?xrdcl.unzip=file2';

// Shape returned by POST /replicas/list on Rucio 41 (verified against rucio-dev)
const replicaRecords = [
    {
        scope: 'test',
        name: 'file1',
        bytes: 10485760,
        md5: '8dac2767785de1cdad6b1681db77b531',
        adler32: '6ee5e505',
        pfns: {
            [FILE1_XRD1_PFN]: {
                rse_id: 'id1',
                rse: 'XRD1',
                type: 'DISK',
                volatile: false,
                domain: 'wan',
                priority: 1,
                client_extract: false,
            },
            [FILE1_XRD3_PFN]: {
                rse_id: 'id3',
                rse: 'XRD3',
                type: 'TAPE',
                volatile: false,
                domain: 'lan',
                priority: 2,
                client_extract: false,
            },
        },
        rses: {
            XRD1: [FILE1_XRD1_PFN],
            XRD3: [FILE1_XRD3_PFN],
        },
        // XRD4 has a replica but no readable protocol, so no PFN
        states: {
            XRD1: 'AVAILABLE',
            XRD3: 'COPYING',
            XRD4: 'BAD',
        },
    },
    {
        scope: 'test',
        name: 'file2',
        bytes: 2048,
        md5: 'abc',
        adler32: '0f63a02a',
        pfns: {
            [FILE2_ZIP_PFN]: {
                rse_id: 'id2',
                rse: 'XRD2',
                type: 'DISK',
                volatile: false,
                domain: 'zip',
                priority: 1,
                client_extract: false,
            },
        },
        rses: {
            XRD2: [FILE2_ZIP_PFN],
        },
        states: {
            XRD2: 'AVAILABLE',
        },
    },
];

describe('Replica Gateway: List File Replicas', () => {
    let capturedBody: any;
    let capturedHeaders: Headers | undefined;

    const mockListReplicas = (status: number, body: string | Readable, headers: Record<string, string> = {}) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/list`,
            method: 'POST',
            includes: 'replicas/list',
            requestValidator: async (req: Request) => {
                capturedBody = JSON.parse(await req.text());
                capturedHeaders = req.headers;
                return true;
            },
            response: {
                status: status,
                headers: { 'Content-Type': 'application/x-json-stream', ...headers },
                body: body,
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    };

    const streamAll = async (dto: ListReplicasDTO): Promise<FileReplicaStateDTO[]> => {
        const stream = dto.stream;
        if (stream == null) {
            throw new Error('stream is null or undefined');
        }
        const receivedData: FileReplicaStateDTO[] = [];
        await new Promise((resolve, reject) => {
            stream.on('data', (data: FileReplicaStateDTO | FileReplicaStateDTO[]) => {
                Array.isArray(data) ? receivedData.push(...data) : receivedData.push(data);
            });
            stream.on('end', resolve);
            stream.on('error', reject);
        });
        return receivedData;
    };

    const listFileReplicas = (options?: ListFileReplicasOptions) => {
        const gateway: ReplicaGatewayOutputPort = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);
        return gateway.listFileReplicas(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'file1', options);
    };

    beforeEach(() => {
        fetchMock.doMock();
        capturedBody = undefined;
        capturedHeaders = undefined;
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('streams one row per PFN and keeps replicas without a PFN', async () => {
        mockListReplicas(200, Readable.from([replicaRecords.map(record => JSON.stringify(record)).join('\n')]));

        const dto = await listFileReplicas();
        expect(dto.status).toBe('success');
        const rows = await streamAll(dto);

        expect(rows).toEqual([
            {
                status: 'success',
                scope: 'test',
                name: 'file1',
                bytes: 10485760,
                adler32: '6ee5e505',
                rse: 'XRD1',
                state: ReplicaState.AVAILABLE,
                pfn: FILE1_XRD1_PFN,
                protocol: 'root',
                domain: 'wan',
                priority: 1,
                rseType: 'DISK',
            },
            {
                status: 'success',
                scope: 'test',
                name: 'file1',
                bytes: 10485760,
                adler32: '6ee5e505',
                rse: 'XRD3',
                state: ReplicaState.COPYING,
                pfn: FILE1_XRD3_PFN,
                protocol: 'davs',
                domain: 'lan',
                priority: 2,
                rseType: 'TAPE',
            },
            {
                status: 'success',
                scope: 'test',
                name: 'file1',
                bytes: 10485760,
                adler32: '6ee5e505',
                rse: 'XRD4',
                state: ReplicaState.BAD,
                pfn: null,
                protocol: null,
                domain: null,
                priority: null,
                rseType: null,
            },
            {
                status: 'success',
                scope: 'test',
                name: 'file2',
                bytes: 2048,
                adler32: '0f63a02a',
                rse: 'XRD2',
                state: ReplicaState.AVAILABLE,
                pfn: FILE2_ZIP_PFN,
                protocol: 'root',
                domain: 'zip',
                priority: 1,
                rseType: 'DISK',
            },
        ]);
    });

    it('sends only the default parameters when no options are given', async () => {
        mockListReplicas(200, Readable.from([JSON.stringify(replicaRecords[1])]));

        await streamAll(await listFileReplicas());

        expect(capturedBody).toEqual({
            dids: [{ scope: 'test', name: 'file1' }],
            all_states: true,
            ignore_availability: true,
        });
        expect(capturedHeaders?.get('X-Forwarded-For')).toBeNull();
    });

    it('passes the CLI options and forwards the client IP', async () => {
        mockListReplicas(200, Readable.from([JSON.stringify(replicaRecords[1])]));

        await streamAll(
            await listFileReplicas({
                schemes: ['root', 'davs'],
                domain: 'all',
                rseExpression: 'tier=1',
                allStates: false,
                clientIp: '188.184.21.108',
            }),
        );

        expect(capturedBody).toEqual({
            dids: [{ scope: 'test', name: 'file1' }],
            all_states: false,
            ignore_availability: true,
            schemes: ['root', 'davs'],
            domain: 'all',
            rse_expression: 'tier=1',
        });
        expect(capturedHeaders?.get('X-Forwarded-For')).toBe('188.184.21.108');
    });

    it('returns the Rucio exception class for an invalid RSE expression', async () => {
        mockListReplicas(
            500,
            JSON.stringify({ ExceptionClass: 'InvalidRSEExpression', ExceptionMessage: 'RSE Expression resulted in an empty set.' }),
            { 'Content-Type': 'application/json', ExceptionClass: 'InvalidRSEExpression' },
        );

        const dto = await listFileReplicas({ rseExpression: 'NOPE' });

        expect(dto.status).toBe('error');
        expect(dto.errorCode).toBe(500);
        expect(dto.errorClass).toBe('InvalidRSEExpression');
    });
});
