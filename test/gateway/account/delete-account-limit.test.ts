import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const base = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/limits`;

describe('Account Gateway: Delete Account Limit', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    const token = MockRucioServerFactory.VALID_RUCIO_TOKEN;
    const errorBody = (cls: string, msg: string) => JSON.stringify({ ExceptionClass: cls, ExceptionMessage: msg });
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    const endpoint = (url: string, status: number, body: string): MockEndpoint => ({
        url,
        method: 'DELETE',
        response: { status, headers: { 'Content-Type': 'application/octet-stream' }, body },
    });

    it('deletes a local limit', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/local/MOCK`, 200, '')]);
        expect((await gateway().deleteAccountLimit(token, 'jdoe', 'local', 'MOCK')).status).toBe('success');
    });

    it('deletes a global limit with an encoded expression', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/global/tier%3D1%26country%3Dch`, 200, '')]);
        expect((await gateway().deleteAccountLimit(token, 'jdoe', 'global', 'tier=1&country=ch')).status).toBe('success');
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/local/MOCK`, 401, errorBody('AccessDenied', 'Access denied'))]);
        expect(await gateway().deleteAccountLimit(token, 'jdoe', 'local', 'MOCK')).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });
});
