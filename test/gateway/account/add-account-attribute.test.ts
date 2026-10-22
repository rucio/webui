import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const base = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/attr`;

describe('Account Gateway: Add Account Attribute', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    const token = MockRucioServerFactory.VALID_RUCIO_TOKEN;
    const errorBody = (cls: string, msg: string) => JSON.stringify({ ExceptionClass: cls, ExceptionMessage: msg });
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    const endpoint = (url: string, status: number, body: string, requestValidator?: MockEndpoint['requestValidator']): MockEndpoint => ({
        url,
        method: 'POST',
        response: { status, headers: { 'Content-Type': 'application/octet-stream' }, body },
        requestValidator,
    });

    it('posts the value and treats Created as success', async () => {
        let received: any;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(`${base}/admin`, 201, 'Created', async req => {
                received = await req.json();
                return true;
            }),
        ]);
        expect((await gateway().addAccountAttribute(token, 'jdoe', 'admin', 'true')).status).toBe('success');
        expect(received).toEqual({ value: 'true' });
    });

    it('encodes the key in the URL', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/a%2Fb`, 201, 'Created')]);
        expect((await gateway().addAccountAttribute(token, 'jdoe', 'a/b', 'x')).status).toBe('success');
    });

    it('reports Duplicate (409)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/admin`, 409, errorBody('Duplicate', 'exists'))]);
        expect(await gateway().addAccountAttribute(token, 'jdoe', 'admin', 'x')).toMatchObject({
            status: 'error',
            errorCode: 409,
            errorClass: 'Duplicate',
        });
    });

    it('reports InvalidObject (500)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/admin`, 500, errorBody('InvalidObject', 'bad key'))]);
        expect(await gateway().addAccountAttribute(token, 'jdoe', 'admin', 'x')).toMatchObject({
            status: 'error',
            errorCode: 500,
            errorClass: 'InvalidObject',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/admin`, 401, errorBody('AccessDenied', 'Access denied'))]);
        expect(await gateway().addAccountAttribute(token, 'jdoe', 'admin', 'x')).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });
});
