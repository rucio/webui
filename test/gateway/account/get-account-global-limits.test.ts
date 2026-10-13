import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const URL = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/limits/global`;

const endpoint = (status: number, body: string, contentType = 'application/json'): MockEndpoint => ({
    url: URL,
    method: 'GET',
    response: { status, headers: { 'Content-Type': contentType }, body },
});

describe('Account Gateway: Get Account Global Limits', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    it('maps limits and turns Infinity into -1', async () => {
        const body =
            '{"MOCK|MOCK2": {"resolved_rses": ["MOCK", "MOCK2"], "resolved_rse_ids": ["id1", "id2"], "limit": 1000},' +
            ' "tier=1": {"resolved_rses": ["T1"], "resolved_rse_ids": ["id3"], "limit": Infinity}}';
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(200, body)]);
        const dto = await gateway().getAccountGlobalLimits(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe');
        expect(dto.status).toBe('success');
        expect(dto.account).toBe('jdoe');
        expect(dto.limits).toEqual({
            'MOCK|MOCK2': { resolvedRses: ['MOCK', 'MOCK2'], limit: 1000 },
            'tier=1': { resolvedRses: ['T1'], limit: -1 },
        });
    });

    it('treats {} as no limits', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(200, '{}')]);
        const dto = await gateway().getAccountGlobalLimits(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe');
        expect(dto.status).toBe('success');
        expect(dto.limits).toEqual({});
    });

    it('reports AccountNotFound (Rucio answers 500 for this endpoint)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(
                500,
                JSON.stringify({ ExceptionClass: 'AccountNotFound', ExceptionMessage: "Account ID 'jdoe' does not exist" }),
                'application/octet-stream',
            ),
        ]);
        expect(await gateway().getAccountGlobalLimits(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 500,
            errorClass: 'AccountNotFound',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(401, JSON.stringify({ ExceptionClass: 'AccessDenied', ExceptionMessage: 'Access denied' }), 'application/octet-stream'),
        ]);
        expect(await gateway().getAccountGlobalLimits(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });

    it('survives a non-JSON 500 body', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(500, '<html>boom</html>', 'text/html')]);
        expect(await gateway().getAccountGlobalLimits(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 500,
        });
    });
});
