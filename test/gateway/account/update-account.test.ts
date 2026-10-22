import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

import { AccountStatus, AccountType } from '@/lib/core/entity/rucio';

const URL = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe`;

describe('Account Gateway: Update Account', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    const token = MockRucioServerFactory.VALID_RUCIO_TOKEN;
    const errorBody = (cls: string, msg: string) => JSON.stringify({ ExceptionClass: cls, ExceptionMessage: msg });
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    const endpoint = (status: number, body: string, requestValidator?: MockEndpoint['requestValidator']): MockEndpoint => ({
        url: URL,
        method: 'PUT',
        response: { status, headers: { 'Content-Type': 'application/octet-stream' }, body },
        requestValidator,
    });

    it('sends only the status when only the status is given', async () => {
        let received: any;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(200, '', async req => {
                received = await req.json();
                return true;
            }),
        ]);
        const dto = await gateway().updateAccount(token, 'jdoe', { status: AccountStatus.SUSPENDED });
        expect(dto.status).toBe('success');
        expect(received).toEqual({ status: 'SUSPENDED' });
    });

    it('maps all defined options and omits undefined keys', async () => {
        let received: any;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(200, '', async req => {
                received = await req.json();
                return true;
            }),
        ]);
        await gateway().updateAccount(token, 'jdoe', { email: null, accountType: AccountType.GROUP, status: undefined });
        expect(received).toEqual({ email: null, account_type: 'GROUP' });
        expect('status' in received).toBe(false);
    });

    it('reports AccountNotFound (404)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(404, errorBody('AccountNotFound', 'no such account'))]);
        expect(await gateway().updateAccount(token, 'jdoe', { email: 'a@b.c' })).toMatchObject({
            status: 'error',
            errorCode: 404,
            errorClass: 'AccountNotFound',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(401, errorBody('AccessDenied', 'Access denied'))]);
        expect(await gateway().updateAccount(token, 'jdoe', { email: 'a@b.c' })).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });
});
