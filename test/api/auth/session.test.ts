import { AuthType, Role, SessionUser } from '@/lib/core/entity/auth-models';
import { addOrUpdateSessionUser, removeSessionUser, setActiveSessionUser, setEmptySession, MockSession } from '@/lib/infrastructure/auth/session-utils';
import { createMockSession } from 'test/fixtures/http-fixtures';

describe('MockSession tests', () => {
    it('should set and get a value in the session', () => {
        const session: MockSession = createMockSession();
        expect(session.user).toBeUndefined();

        setEmptySession(session);
        expect(session.user).toBeDefined();
        expect(session.allUsers).toHaveLength(1);

        session.user = {
            rucioIdentity: 'ddmlab',
            rucioAccount: 'root',
            rucioAuthToken: 'rucio-ddmlab-askdjljioj',
            rucioAuthTokenExpires: '2021-09-01T12:00:00Z',
            rucioAuthType: AuthType.x509,
            role: Role.ADMIN,
            rucioOIDCProvider: 'cern',
            rucioVO: 'def',
            isLoggedIn: true,
        };
        // MockSession.save() is a jest.fn() mock - no need to await
        expect(session.user).toHaveProperty('rucioIdentity');
        expect(session.user?.rucioIdentity).toBe('ddmlab');
        expect(session.user).toHaveProperty('rucioAuthToken');
        expect(session.user?.rucioAuthToken).toBe('rucio-ddmlab-askdjljioj');
        expect(session.user).toHaveProperty('rucioAccount');
        expect(session.user?.rucioAccount).toBe('root');
        expect(session.user).toHaveProperty('isLoggedIn');
        expect(session.user?.isLoggedIn).toBe(true);
    });

    it('should add a new, update and delete user to/from the session', () => {
        const session: MockSession = createMockSession();

        session.allUsers = [];

        const sessionUserPassDDMLab: SessionUser = {
            rucioAuthToken: 'rucio-ddmlab-adadadad',
            rucioAuthTokenExpires: '2021-09-01T12:00:00Z',
            rucioAccount: 'root',
            rucioIdentity: 'ddmlab',
            rucioAuthType: AuthType.USERPASS,
            role: Role.ADMIN,
            rucioVO: 'def',
            rucioOIDCProvider: null,
            isLoggedIn: true,
        };

        const sessionUserX509DDMLab: SessionUser = {
            rucioAuthToken: 'rucio-ddmlab-adasfgdbg',
            rucioAuthTokenExpires: '2022-10-01T12:00:00Z',
            rucioAccount: 'root',
            rucioIdentity: 'ddmlab',
            rucioAuthType: AuthType.x509,
            role: Role.ADMIN,
            rucioVO: 'def',
            rucioOIDCProvider: null,
            isLoggedIn: true,
        };

        addOrUpdateSessionUser(session, sessionUserPassDDMLab);
        expect(session.allUsers).toHaveLength(1);

        addOrUpdateSessionUser(session, sessionUserX509DDMLab);
        expect(session.allUsers).toHaveLength(2);

        sessionUserX509DDMLab.rucioAuthTokenExpires = '2021-11-01T12:00:00Z';
        addOrUpdateSessionUser(session, sessionUserX509DDMLab);
        expect(session.allUsers).toHaveLength(2);
        expect(session.allUsers[1].rucioAuthTokenExpires).toBe('2021-11-01T12:00:00Z');

        removeSessionUser(session, sessionUserX509DDMLab);
        expect(session.allUsers).toHaveLength(1);
    });

    it('should manage an active session user', () => {
        const session: MockSession = createMockSession();
        const sessionUserPassDDMLab: SessionUser = {
            rucioAuthToken: 'rucio-ddmlab-adadadad',
            rucioAuthTokenExpires: '2021-09-01T12:00:00Z',
            rucioAccount: 'root',
            rucioIdentity: 'ddmlab',
            rucioAuthType: AuthType.USERPASS,
            role: Role.USER,
            rucioOIDCProvider: null,
            rucioVO: 'def',
            isLoggedIn: true,
        };

        const autreUser: SessionUser = {
            rucioAuthToken: 'rucio-autre-adagfdsfg',
            rucioAuthTokenExpires: '2022-11-01T12:00:00Z',
            rucioAccount: 'root',
            rucioIdentity: 'autre',
            rucioAuthType: AuthType.USERPASS,
            role: Role.USER,
            rucioOIDCProvider: null,
            rucioVO: 'def',
            isLoggedIn: true,
        };

        setActiveSessionUser(session, sessionUserPassDDMLab);
        expect(session.user?.rucioAuthToken).toBe('rucio-ddmlab-adadadad');

        setActiveSessionUser(session, autreUser);
        expect(session.user?.rucioAuthToken).toBe('rucio-autre-adagfdsfg');
        expect(session.allUsers).toHaveLength(2);

        removeSessionUser(session, sessionUserPassDDMLab);
        expect(session.user?.rucioAccount).toBe('root');
        expect(session.allUsers).toHaveLength(1);

        removeSessionUser(session, autreUser);
        expect(session.user).toBeUndefined();
        expect(session.allUsers).toHaveLength(0);
    });
});
