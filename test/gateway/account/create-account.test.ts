import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

import { AccountType } from '@/lib/core/entity/rucio';

const URL = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe`;

describe('Account Gateway: Create Account', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    const token = MockRucioServerFactory.VALID_RUCIO_TOKEN;
    const errorBody = (cls: string, msg: string) => JSON.stringify({ ExceptionClass: cls, ExceptionMessage: msg });
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    const endpoint = (status: number, body: string, requestValidator?: MockEndpoint['requestValidator']): MockEndpoint => ({
        url: URL,
        method: 'POST',
        response: { status, headers: { 'Content-Type': 'application/octet-stream' }, body },
        requestValidator,
    });

    it('treats the 201 Created text as success and sends type and email', async () => {
        let received: any;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(201, 'Created', async req => {
                received = await req.json();
                return true;
            }),
        ]);
        const dto = await gateway().createAccount(token, 'jdoe', AccountType.USER, 'j@doe.org');
        expect(dto.status).toBe('success');
        expect(received).toEqual({ type: 'USER', email: 'j@doe.org' });
    });

    it('always sends the email key, null when there is none', async () => {
        let received: any;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(201, 'Created', async req => {
                received = await req.json();
                return true;
            }),
        ]);
        await gateway().createAccount(token, 'jdoe', AccountType.SERVICE, null);
        expect(received).toEqual({ type: 'SERVICE', email: null });
    });

    it('reports Duplicate (409)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(409, errorBody('Duplicate', 'Account already exists'))]);
        expect(await gateway().createAccount(token, 'jdoe', AccountType.USER, null)).toMatchObject({
            status: 'error',
            errorCode: 409,
            errorClass: 'Duplicate',
        });
    });

    it('reports InvalidAccountType (400)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(400, errorBody('InvalidAccountType', 'bad type'))]);
        expect(await gateway().createAccount(token, 'jdoe', AccountType.UNKNOWN, null)).toMatchObject({
            status: 'error',
            errorCode: 400,
            errorClass: 'InvalidAccountType',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(401, errorBody('AccessDenied', 'Access denied'))]);
        expect(await gateway().createAccount(token, 'jdoe', AccountType.USER, null)).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });
});
