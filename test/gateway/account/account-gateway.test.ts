import { AccountAttributeErrorTypesDTO, AccountAttributesDTO, ListAccountsForIdentityDTO } from '@/lib/core/dto/account-dto';
import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { getIronSession } from 'iron-session';
import { createMocks } from 'node-mocks-http';

describe('Account Gateway Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, req => {
            if (req.url.endsWith('/accounts/ddmadmin/attr')) {
                const rucioToken = req.headers.get('X-Rucio-Auth-Token');
                if (rucioToken !== 'rucio-ddmlab-askdjljioj') {
                    return Promise.resolve({
                        status: 401,
                    });
                }
                expect(req.headers.get('X-Rucio-Auth-Token')).toBe('rucio-ddmlab-askdjljioj');
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([
                        {
                            key: 'admin',
                            value: 'True',
                        },
                        {
                            key: 'country-tw',
                            value: 'user',
                        },
                    ]),
                });
            }
        });
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    test('it should return account attributes', async () => {
        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT);
        const accoutAttrs: AccountAttributesDTO = await rucioAccountGateway.listAccountAttributes('ddmadmin', 'rucio-ddmlab-askdjljioj');
        expect(accoutAttrs).toEqual({
            status: 'OK',
            account: 'ddmadmin',
            attributes: [
                {
                    key: 'admin',
                    value: 'True',
                },
                {
                    key: 'country-tw',
                    value: 'user',
                },
            ],
        });
    });
    test('it should return authentication error with invalid token request', async () => {
        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT);
        try {
            const accoutAttrs: AccountAttributesDTO = await rucioAccountGateway.listAccountAttributes('ddmadmin', 'invalid-token');
        } catch (error: AccountAttributesDTO | any) {
            error.status = 'ERROR';
            expect(error).toEqual({
                status: 'ERROR',
                error: AccountAttributeErrorTypesDTO.RUCIO_AUTH_TOKEN_IS_INVALID_OR_EXPIRED,
                account: 'ddmadmin',
                attributes: {},
                message: 'Rucio Auth Token is invalid or expired',
            });
        }
    });
});

describe('Account Gateway - listAccountsForIdentity', () => {
    afterEach(() => {
        fetchMock.dontMock();
    });

    test('should return multiple accounts for a known identity', async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/^https?:\/\/rucio-host\.com.*$/, req => {
            if (req.url.includes('/identities/accounts')) {
                return Promise.resolve({
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify([{ account: 'root' }, { account: 'atlas' }]),
                });
            }
            return Promise.resolve({ status: 404 });
        });

        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT);
        const result: ListAccountsForIdentityDTO = await rucioAccountGateway.listAccountsForIdentity(
            'ddmlab',
            'userpass',
            'rucio-ddmlab-askdjljioj',
        );
        expect(result.status).toBe('success');
        expect(result.accounts).toEqual(['root', 'atlas']);
    });

    test('should return error when identity is not found (non-OK HTTP status)', async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/^https?:\/\/rucio-host\.com.*$/, req => {
            if (req.url.includes('/identities/accounts')) {
                return Promise.resolve({ status: 404 });
            }
            return Promise.resolve({ status: 404 });
        });

        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT);
        const result: ListAccountsForIdentityDTO = await rucioAccountGateway.listAccountsForIdentity(
            'unknown-user',
            'userpass',
            'some-token',
        );
        expect(result.status).toBe('error');
        expect(result.accounts).toEqual([]);
        expect(result.message).toContain('404');
    });

    test('should return error on network failure', async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/^https?:\/\/rucio-host\.com.*$/, req => {
            if (req.url.includes('/identities/accounts')) {
                return Promise.reject(new Error('Network failure'));
            }
            return Promise.resolve({ status: 500 });
        });

        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT);
        const result: ListAccountsForIdentityDTO = await rucioAccountGateway.listAccountsForIdentity(
            'ddmlab',
            'userpass',
            'rucio-ddmlab-askdjljioj',
        );
        expect(result.status).toBe('error');
        expect(result.message).toContain('Network error');
    });

    test('should return error on malformed JSON response', async () => {
        fetchMock.doMock();
        fetchMock.mockIf(/^https?:\/\/rucio-host\.com.*$/, req => {
            if (req.url.includes('/identities/accounts')) {
                return Promise.resolve({
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: '{not-valid-json',
                });
            }
            return Promise.resolve({ status: 404 });
        });

        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT);
        const result: ListAccountsForIdentityDTO = await rucioAccountGateway.listAccountsForIdentity(
            'ddmlab',
            'userpass',
            'rucio-ddmlab-askdjljioj',
        );
        expect(result.status).toBe('error');
        expect(result.message).toBe('Failed to parse response');
    });
});
