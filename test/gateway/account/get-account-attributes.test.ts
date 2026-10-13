import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const URL = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/attr/`;

const endpoint = (status: number, body: string, contentType = 'application/json'): MockEndpoint => ({
    url: URL,
    method: 'GET',
    response: { status, headers: { 'Content-Type': contentType }, body },
});

describe('Account Gateway: Get Account Attributes', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    it('requests the trailing-slash URL and preserves boolean values', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(
                200,
                JSON.stringify([
                    { key: 'admin', value: true },
                    { key: 'country-tw', value: 'user' },
                ]),
            ),
        ]);
        const dto = await gateway().getAccountAttributes(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe');
        expect(dto.status).toBe('success');
        expect(dto.account).toBe('jdoe');
        expect(dto.attributes).toEqual([
            { key: 'admin', value: true },
            { key: 'country-tw', value: 'user' },
        ]);
    });

    it('treats [] as success with no attributes', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(200, '[]')]);
        const dto = await gateway().getAccountAttributes(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe');
        expect(dto.status).toBe('success');
        expect(dto.attributes).toEqual([]);
    });

    it('reports AccountNotFound', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(
                404,
                JSON.stringify({ ExceptionClass: 'AccountNotFound', ExceptionMessage: "Account ID 'jdoe' does not exist" }),
                'application/octet-stream',
            ),
        ]);
        expect(await gateway().getAccountAttributes(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 404,
            errorClass: 'AccountNotFound',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(401, JSON.stringify({ ExceptionClass: 'AccessDenied', ExceptionMessage: 'Access denied' }), 'application/octet-stream'),
        ]);
        expect(await gateway().getAccountAttributes(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });

    it('survives a non-JSON 500 body', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(500, '<html>boom</html>', 'text/html')]);
        expect(await gateway().getAccountAttributes(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 500,
        });
    });
});
