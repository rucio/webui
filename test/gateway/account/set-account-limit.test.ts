import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const base = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/limits`;

describe('Account Gateway: Set Account Limit', () => {
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

    it('sets a local RSE limit', async () => {
        let received: any;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(`${base}/local/MOCK`, 201, 'Created', async req => {
                received = await req.json();
                return true;
            }),
        ]);
        expect((await gateway().setAccountLimit(token, 'jdoe', 'local', 'MOCK', 1000)).status).toBe('success');
        expect(received).toEqual({ bytes: 1000 });
    });

    it('url-encodes a global RSE expression', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/global/tier%3D1%26country%3Dch`, 201, 'Created')]);
        expect((await gateway().setAccountLimit(token, 'jdoe', 'global', 'tier=1&country=ch', 5)).status).toBe('success');
    });

    it('sends -1 for unlimited', async () => {
        let received: any;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(`${base}/local/MOCK`, 201, 'Created', async req => {
                received = await req.json();
                return true;
            }),
        ]);
        await gateway().setAccountLimit(token, 'jdoe', 'local', 'MOCK', -1);
        expect(received).toEqual({ bytes: -1 });
    });

    it('reports RSENotFound (404)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/local/NOPE`, 404, errorBody('RSENotFound', 'RSE NOPE not found'))]);
        expect(await gateway().setAccountLimit(token, 'jdoe', 'local', 'NOPE', 1)).toMatchObject({
            status: 'error',
            errorCode: 404,
            errorClass: 'RSENotFound',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(`${base}/local/MOCK`, 401, errorBody('AccessDenied', 'Access denied'))]);
        expect(await gateway().setAccountLimit(token, 'jdoe', 'local', 'MOCK', 1)).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });
});
