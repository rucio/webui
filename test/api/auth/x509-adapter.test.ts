/**
 * Unit tests for authorizeX509 (src/lib/infrastructure/auth/nextauth-x509-adapter.ts).
 *
 * The adapter is used by NextAuth's x509 credentials provider's authorize().
 * Beyond building a SessionUser from the pre-validated Rucio token (delegated
 * to SetX509LoginSessionUseCase), it now (#628) also calls
 * AccountGatewayOutputPort.listAccountsForIdentity to populate
 * SessionUser.identityAccounts so the AccountDropdown can offer silent
 * cert-driven switches into other accounts on the same DN.
 *
 * Coverage:
 * (a) Successful login with multi-account identity → identityAccounts is set
 * (b) Successful login with empty identity-account list → identityAccounts undefined
 * (c) Successful login when identity lookup fails → primary login still
 *     succeeds, identityAccounts undefined
 */

const listAccountsForIdentityMock = jest.fn();
const listAccountAttributesMock = jest.fn();
const voListMock = jest.fn();

jest.mock('@/lib/infrastructure/ioc/container-config', () => {
    const GATEWAYS = jest.requireActual('@/lib/infrastructure/ioc/ioc-symbols-gateway').default;
    return {
        __esModule: true,
        default: {
            get: jest.fn((symbol: symbol) => {
                if (symbol === GATEWAYS.ENV_CONFIG) {
                    return { voList: voListMock };
                }
                if (symbol === GATEWAYS.ACCOUNT) {
                    return {
                        listAccountAttributes: listAccountAttributesMock,
                        listAccountsForIdentity: listAccountsForIdentityMock,
                    };
                }
                throw new Error(`Unexpected IoC symbol in test: ${String(symbol)}`);
            }),
        },
    };
});

import { authorizeX509 } from '@/lib/infrastructure/auth/nextauth-x509-adapter';
import { AuthType } from '@/lib/core/entity/auth-models';

const VO = { shortName: 'def', name: 'default', logoUrl: '', oidcEnabled: false, oidcProviders: [] };

// SetX509LoginSessionUseCase derives rucioIdentity by splitting the token on '-' and taking [1].
// Construct the input token so the parsed identity matches what we mock below.
const RUCIO_IDENTITY = '/C=GB/O=Acme/CN=Test User';
const TOKEN = `rucio-${RUCIO_IDENTITY}-suffix`;

beforeEach(() => {
    jest.clearAllMocks();
    voListMock.mockResolvedValue([VO]);
    listAccountAttributesMock.mockResolvedValue({
        account: 'root',
        attributes: [],
        status: 'OK',
    });
});

describe('authorizeX509 — identityAccounts (#628)', () => {
    it('(a) populates identityAccounts when identity maps to multiple accounts', async () => {
        listAccountsForIdentityMock.mockResolvedValue({ status: 'success', accounts: ['root', 'atlas', 'cms'] });

        const user = await authorizeX509(TOKEN, 'root', 'def', '2030-01-01T00:00:00Z');

        expect(user).not.toBeNull();
        expect(user!.rucioAuthType).toBe(AuthType.x509);
        expect(user!.rucioAccount).toBe('root');
        expect(user!.identityAccounts).toEqual(['root', 'atlas', 'cms']);
        expect(listAccountsForIdentityMock).toHaveBeenCalledWith(RUCIO_IDENTITY, 'x509', TOKEN);
    });

    it('(b) leaves identityAccounts undefined when lookup returns an empty list', async () => {
        listAccountsForIdentityMock.mockResolvedValue({ status: 'success', accounts: [] });

        const user = await authorizeX509(TOKEN, 'root', 'def', '2030-01-01T00:00:00Z');

        expect(user).not.toBeNull();
        expect(user!.identityAccounts).toBeUndefined();
    });

    it('(c) primary login still succeeds when identity lookup errors', async () => {
        listAccountsForIdentityMock.mockResolvedValue({ status: 'error', accounts: [], message: 'HTTP 500' });

        const user = await authorizeX509(TOKEN, 'root', 'def', '2030-01-01T00:00:00Z');

        expect(user).not.toBeNull();
        expect(user!.rucioAccount).toBe('root');
        expect(user!.identityAccounts).toBeUndefined();
    });
});
