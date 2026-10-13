import { AccountListItemDTO } from '@/lib/core/dto/account-dto';
import { AccountType } from '@/lib/core/entity/rucio';
import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { collectStreamedData } from 'test/fixtures/stream-test-utils';

const BASE = `${MockRucioServerFactory.RUCIO_HOST}/accounts/`;

const ndjson =
    [
        { account: 'ddmadmin', type: 'SERVICE', email: 'ddmadmin@example.com' },
        { account: 'grp', type: 'GROUP', email: 'grp@example.com' },
        { account: 'root', type: 'SERVICE', email: null },
    ]
        .map(o => JSON.stringify(o))
        .join('\n') + '\n';

const endpoint = (
    status: number,
    body: string,
    requestValidator?: (req: Request) => Promise<boolean>,
    contentType = 'application/x-json-stream',
): MockEndpoint => ({
    url: BASE,
    method: 'GET',
    includes: '/accounts/',
    requestValidator,
    response: { status, headers: { 'Content-Type': contentType }, body },
});

describe('Account Gateway: List Accounts', () => {
    const gateway = () => appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
    beforeEach(() => fetchMock.doMock());
    afterEach(() => fetchMock.dontMock());

    it('streams accounts with normalised types and null emails', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(200, ndjson, async req => new URL(req.url).search === '' && req.headers.get('Accept') === 'application/x-json-stream'),
        ]);
        const dto = await gateway().listAccounts(MockRucioServerFactory.VALID_RUCIO_TOKEN, {});
        expect(dto.status).toBe('success');
        const rows = await collectStreamedData<AccountListItemDTO>(dto.stream);
        expect(rows).toEqual([
            { status: 'success', account: 'ddmadmin', accountType: AccountType.SERVICE, email: 'ddmadmin@example.com' },
            { status: 'success', account: 'grp', accountType: AccountType.GROUP, email: 'grp@example.com' },
            { status: 'success', account: 'root', accountType: AccountType.SERVICE, email: null },
        ]);
    });

    it('sends only the set filter keys as query parameters', async () => {
        let seen: URLSearchParams | undefined;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(200, '', async req => {
                seen = new URL(req.url).searchParams;
                return true;
            }),
        ]);
        const dto = await gateway().listAccounts(MockRucioServerFactory.VALID_RUCIO_TOKEN, {
            account: 'j*',
            accountType: AccountType.GROUP,
            identity: 'CN=x',
        });
        await collectStreamedData(dto.stream);
        expect(seen?.get('account')).toBe('j*');
        expect(seen?.get('account_type')).toBe('GROUP');
        expect(seen?.get('identity')).toBe('CN=x');
    });

    it('omits unset filter keys', async () => {
        let seen: URLSearchParams | undefined;
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(200, '', async req => {
                seen = new URL(req.url).searchParams;
                return true;
            }),
        ]);
        const dto = await gateway().listAccounts(MockRucioServerFactory.VALID_RUCIO_TOKEN, { identity: 'ddmlab' });
        await collectStreamedData(dto.stream);
        expect(Array.from(seen!.keys())).toEqual(['identity']);
    });

    it('yields an empty stream for an empty body', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(200, '')]);
        const dto = await gateway().listAccounts(MockRucioServerFactory.VALID_RUCIO_TOKEN, {});
        expect(dto.status).toBe('success');
        expect(await collectStreamedData(dto.stream)).toEqual([]);
    });

    it('reports AccessDenied (401)', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            endpoint(
                401,
                JSON.stringify({ ExceptionClass: 'AccessDenied', ExceptionMessage: 'Access denied' }),
                undefined,
                'application/octet-stream',
            ),
        ]);
        expect(await gateway().listAccounts(MockRucioServerFactory.VALID_RUCIO_TOKEN, {})).toMatchObject({
            status: 'error',
            errorCode: 401,
            errorClass: 'AccessDenied',
        });
    });

    it('survives a non-JSON 500 body', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [endpoint(500, "<html>'service'</html>", undefined, 'text/html')]);
        expect(await gateway().listAccounts(MockRucioServerFactory.VALID_RUCIO_TOKEN, {})).toMatchObject({ status: 'error', errorCode: 500 });
    });
});
