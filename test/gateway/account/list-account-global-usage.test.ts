import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const URL = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/usage/global`;

const endpoint = (status: number, body: string, contentType = 'application/x-json-stream'): MockEndpoint => ({
    url: URL,
    method: 'GET',
    requestValidator: async (req: Request) => req.headers.get('Accept') === 'application/x-json-stream',
    response: { status, headers: { 'Content-Type': contentType }, body },
});

describe('Account Gateway: List Account Global Usage', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    it('parses NDJSON usage and turns Infinity into -1', async () => {
        const body = [
            '{"rse_expression": "MOCK|MOCK2", "bytes": 100, "files": 2, "bytes_limit": 1000, "bytes_remaining": 900}',
            '{"rse_expression": "tier=1", "bytes": 5, "files": 1, "bytes_limit": Infinity, "bytes_remaining": Infinity}',
        ].join('\n');
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(200, body)]);
        const dto = await gateway().listAccountGlobalUsage(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe');
        expect(dto.status).toBe('success');
        expect(dto.account).toBe('jdoe');
        expect(dto.usage).toEqual([
            { rseExpression: 'MOCK|MOCK2', bytes: 100, files: 2, bytesLimit: 1000, bytesRemaining: 900 },
            { rseExpression: 'tier=1', bytes: 5, files: 1, bytesLimit: -1, bytesRemaining: -1 },
        ]);
    });

    it('treats an empty body as no usage', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(200, '')]);
        const dto = await gateway().listAccountGlobalUsage(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe');
        expect(dto.status).toBe('success');
        expect(dto.usage).toEqual([]);
    });

    it('reports AccountNotFound', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(
                404,
                JSON.stringify({ ExceptionClass: 'AccountNotFound', ExceptionMessage: "Account ID 'jdoe' does not exist" }),
                'application/octet-stream',
            ),
        ]);
        expect(await gateway().listAccountGlobalUsage(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 404,
            errorClass: 'AccountNotFound',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(401, JSON.stringify({ ExceptionClass: 'AccessDenied', ExceptionMessage: 'Access denied' }), 'application/octet-stream'),
        ]);
        expect(await gateway().listAccountGlobalUsage(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });

    it('survives a non-JSON 500 body', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(500, '<html>boom</html>', 'text/html')]);
        expect(await gateway().listAccountGlobalUsage(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 500,
        });
    });
});
