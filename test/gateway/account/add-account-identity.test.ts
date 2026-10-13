import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

import { IdentityType } from '@/lib/core/entity/account';

const URL = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/identities`;

describe('Account Gateway: Add Account Identity', () => {
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
    const capture = () => {
        const holder: { body?: any } = {};
        const validator: MockEndpoint['requestValidator'] = async req => {
            holder.body = await req.json();
            return true;
        };
        return { holder, validator };
    };

    it('sends identity, authtype, email and default, without a password when undefined', async () => {
        const { holder, validator } = capture();
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(201, 'Created', validator)]);
        const dto = await gateway().addAccountIdentity(token, 'jdoe', 'jdoe@cern.ch', IdentityType.GSS, 'j@doe.org');
        expect(dto.status).toBe('success');
        expect(holder.body).toEqual({ identity: 'jdoe@cern.ch', authtype: 'GSS', email: 'j@doe.org', default: false });
        expect('password' in holder.body).toBe(false);
    });

    it('includes the password and default flag when given', async () => {
        const { holder, validator } = capture();
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(201, 'Created', validator)]);
        await gateway().addAccountIdentity(token, 'jdoe', 'jdoe', IdentityType.USERPASS, 'j@doe.org', 's3cret', true);
        expect(holder.body).toEqual({ identity: 'jdoe', authtype: 'USERPASS', email: 'j@doe.org', default: true, password: 's3cret' });
    });

    it('reports IdentityError (400) for a missing password', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(400, errorBody('IdentityError', 'You must provide a password!'))]);
        expect(await gateway().addAccountIdentity(token, 'jdoe', 'jdoe', IdentityType.USERPASS, 'j@doe.org')).toMatchObject({
            status: 'error',
            errorCode: 400,
            errorClass: 'IdentityError',
            errorMessage: 'You must provide a password!',
        });
    });

    it('reports Duplicate (409)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(409, errorBody('Duplicate', 'already mapped'))]);
        expect(await gateway().addAccountIdentity(token, 'jdoe', 'jdoe', IdentityType.GSS, 'j@doe.org')).toMatchObject({
            status: 'error',
            errorCode: 409,
            errorClass: 'Duplicate',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(401, errorBody('AccessDenied', 'Access denied'))]);
        expect(await gateway().addAccountIdentity(token, 'jdoe', 'jdoe', IdentityType.GSS, 'j@doe.org')).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });
});
