import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const URL = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/attr/admin`;

describe('Account Gateway: Delete Account Attribute', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    const token = MockRucioServerFactory.VALID_RUCIO_TOKEN;
    const errorBody = (cls: string, msg: string) => JSON.stringify({ ExceptionClass: cls, ExceptionMessage: msg });
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    const endpoint = (status: number, body: string): MockEndpoint => ({
        url: URL,
        method: 'DELETE',
        response: { status, headers: { 'Content-Type': 'application/octet-stream' }, body },
    });

    it('treats an empty 200 as success', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(200, '')]);
        expect((await gateway().deleteAccountAttribute(token, 'jdoe', 'admin')).status).toBe('success');
    });

    it('reports AccountNotFound (404)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(404, errorBody('AccountNotFound', 'no such account'))]);
        expect(await gateway().deleteAccountAttribute(token, 'jdoe', 'admin')).toMatchObject({
            status: 'error',
            errorCode: 404,
            errorClass: 'AccountNotFound',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(401, errorBody('AccessDenied', 'Access denied'))]);
        expect(await gateway().deleteAccountAttribute(token, 'jdoe', 'admin')).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });
});
