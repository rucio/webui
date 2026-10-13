import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

import { IdentityType } from '@/lib/core/entity/account';

const URL = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/identities`;

describe('Account Gateway: Delete Account Identity', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    const token = MockRucioServerFactory.VALID_RUCIO_TOKEN;
    const errorBody = (cls: string, msg: string) => JSON.stringify({ ExceptionClass: cls, ExceptionMessage: msg });
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    const endpoint = (status: number, body: string, requestValidator?: MockEndpoint['requestValidator']): MockEndpoint => ({
        url: URL,
        method: 'DELETE',
        response: { status, headers: { 'Content-Type': 'application/octet-stream' }, body },
        requestValidator,
    });

    it('sends the identity and authtype as a JSON body on the DELETE', async () => {
        let received: any;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(200, '', async req => {
                received = await req.json();
                return true;
            }),
        ]);
        const dto = await gateway().deleteAccountIdentity(token, 'jdoe', 'jdoe@cern.ch', IdentityType.GSS);
        expect(dto.status).toBe('success');
        expect(received).toEqual({ identity: 'jdoe@cern.ch', authtype: 'GSS' });
    });

    it('reports IdentityError (404)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(404, errorBody('IdentityError', 'Identity not found'))]);
        expect(await gateway().deleteAccountIdentity(token, 'jdoe', 'x', IdentityType.GSS)).toMatchObject({
            status: 'error',
            errorCode: 404,
            errorClass: 'IdentityError',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(401, errorBody('AccessDenied', 'Access denied'))]);
        expect(await gateway().deleteAccountIdentity(token, 'jdoe', 'x', IdentityType.GSS)).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });
});
