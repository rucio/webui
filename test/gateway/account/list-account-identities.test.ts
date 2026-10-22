import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { IdentityType } from '@/lib/core/entity/account';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const URL = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/identities`;
const ndjson = [
    { type: 'USERPASS', identity: 'ddmlab', email: 'rucio-dev@cern.ch' },
    { type: 'X509', identity: 'CN=Rucio User', email: 'rucio-dev@cern.ch' },
    { type: 'weird', identity: 'x', email: 'x@y.z' },
]
    .map(o => JSON.stringify(o))
    .join('\n');

const errorEndpoint = (status: number, body: string, contentType = 'application/octet-stream'): MockEndpoint => ({
    url: URL,
    method: 'GET',
    response: { status, headers: { 'Content-Type': contentType }, body },
});

describe('Account Gateway: List Account Identities', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    it('parses NDJSON identities and maps unknown types to UNKNOWN', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            {
                url: URL,
                method: 'GET',
                requestValidator: async (req: Request) => req.headers.get('Accept') === 'application/x-json-stream',
                response: { status: 200, headers: { 'Content-Type': 'application/x-json-stream' }, body: ndjson },
            },
        ]);
        const dto = await gateway().listAccountIdentities(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe');
        expect(dto.status).toBe('success');
        expect(dto.account).toBe('jdoe');
        expect(dto.identities).toEqual([
            { identity: 'ddmlab', type: IdentityType.USERPASS, email: 'rucio-dev@cern.ch' },
            { identity: 'CN=Rucio User', type: IdentityType.X509, email: 'rucio-dev@cern.ch' },
            { identity: 'x', type: IdentityType.UNKNOWN, email: 'x@y.z' },
        ]);
    });

    it('treats an empty body as no identities', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            { url: URL, method: 'GET', response: { status: 200, headers: { 'Content-Type': 'application/x-json-stream' }, body: '' } },
        ]);
        const dto = await gateway().listAccountIdentities(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe');
        expect(dto.status).toBe('success');
        expect(dto.identities).toEqual([]);
    });

    it('reports AccountNotFound', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            errorEndpoint(404, JSON.stringify({ ExceptionClass: 'AccountNotFound', ExceptionMessage: "Account ID 'jdoe' does not exist" })),
        ]);
        expect(await gateway().listAccountIdentities(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 404,
            errorClass: 'AccountNotFound',
        });
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            errorEndpoint(401, JSON.stringify({ ExceptionClass: 'AccessDenied', ExceptionMessage: 'Access denied' })),
        ]);
        expect(await gateway().listAccountIdentities(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe')).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });

    it('survives a non-JSON 500 body', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [errorEndpoint(500, '<html>boom</html>', 'text/html')]);
        const dto = await gateway().listAccountIdentities(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'jdoe');
        expect(dto).toMatchObject({ status: 'error', errorCode: 500 });
        expect(dto.errorClass).toBeUndefined();
    });
});
