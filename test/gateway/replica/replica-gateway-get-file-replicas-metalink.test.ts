import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';

// Captured from rucio-dev (Rucio 41) for `rucio replica list file --metalink test:file1`
const METALINK = `<?xml version="1.0" encoding="UTF-8"?>
<metalink xmlns="urn:ietf:params:xml:ns:metalink">
 <file name="file1">
  <identity>test:file1</identity>
  <hash type="adler32">6ee5e505</hash>
  <size>10485760</size>
  <url location="XRD1" domain="wan" priority="1" client_extract="false">root://xrd1:1094//rucio/test/80/25/file1</url>
 </file>
</metalink>
`;

describe('Replica Gateway: Get File Replicas Metalink', () => {
    let capturedBody: any;
    let capturedHeaders: Headers | undefined;

    const mockMetalink = (status: number, body: string, headers: Record<string, string>) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/list`,
            method: 'POST',
            includes: 'replicas/list',
            requestValidator: async (req: Request) => {
                capturedBody = JSON.parse(await req.text());
                capturedHeaders = req.headers;
                return true;
            },
            response: { status, headers, body },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    };

    const gateway = () => appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);

    beforeEach(() => {
        fetchMock.doMock();
        capturedBody = undefined;
        capturedHeaders = undefined;
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('returns the metalink document as text and asks Rucio for metalink', async () => {
        mockMetalink(200, METALINK, { 'Content-Type': 'application/metalink4+xml' });

        const dto = await gateway().getFileReplicasMetalink(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'file1', {
            schemes: ['root'],
            clientIp: '188.184.21.108',
        });

        expect(dto).toEqual({ status: 'success', xml: METALINK });
        expect(capturedHeaders?.get('Accept')).toBe('application/metalink4+xml');
        expect(capturedHeaders?.get('X-Forwarded-For')).toBe('188.184.21.108');
        expect(capturedBody).toEqual({
            dids: [{ scope: 'test', name: 'file1' }],
            all_states: true,
            ignore_availability: true,
            schemes: ['root'],
        });
    });

    it('returns the Rucio exception class on error', async () => {
        mockMetalink(500, JSON.stringify({ ExceptionClass: 'InvalidRSEExpression', ExceptionMessage: 'RSE Expression resulted in an empty set.' }), {
            'Content-Type': 'application/json',
            ExceptionClass: 'InvalidRSEExpression',
        });

        const dto = await gateway().getFileReplicasMetalink(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'file1', { rseExpression: 'NOPE' });

        expect(dto.status).toBe('error');
        expect(dto.errorCode).toBe(500);
        expect(dto.errorClass).toBe('InvalidRSEExpression');
    });
});
