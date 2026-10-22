import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('Gateway endpoints carry ExceptionClass', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('reads ExceptionClass from the JSON body on 401', async () => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/root`,
            method: 'GET',
            response: {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ExceptionClass: 'AccessDenied', ExceptionMessage: 'nope' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
        const accountGateway: AccountGatewayOutputPort = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
        const dto = await accountGateway.getAccountInfo('root', MockRucioServerFactory.VALID_RUCIO_TOKEN);
        expect(dto.status).toBe('error');
        expect(dto.errorCode).toBe(401);
        expect(dto.errorClass).toBe('AccessDenied');
        expect(dto.errorMessage).toBe('nope');
    });

    it('falls back to the ExceptionClass header on 409', async () => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/root`,
            method: 'GET',
            response: {
                status: 409,
                headers: { ExceptionClass: 'Duplicate' },
                body: 'not json',
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
        const accountGateway: AccountGatewayOutputPort = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
        const dto = await accountGateway.getAccountInfo('root', MockRucioServerFactory.VALID_RUCIO_TOKEN);
        expect(dto.errorClass).toBe('Duplicate');
    });

    it('leaves errorClass undefined for a text/html 500', async () => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/root`,
            method: 'GET',
            response: {
                status: 500,
                headers: { 'Content-Type': 'text/html' },
                body: "'FOO'",
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
        const accountGateway: AccountGatewayOutputPort = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
        const dto = await accountGateway.getAccountInfo('root', MockRucioServerFactory.VALID_RUCIO_TOKEN);
        expect(dto.errorClass).toBeUndefined();
        expect(dto.errorCode).toBe(500);
    });
});
