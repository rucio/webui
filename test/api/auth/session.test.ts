import { SessionUser } from "@/lib/core/entity/auth-models";
import { addOrUpdateSessionUser, removeSessionUser, setActiveSessionUser, setEmptySession } from "@/lib/infrastructure/auth/session-utils";
import { getIronSession, IronSession } from "iron-session";
import { createMocks } from "node-mocks-http";

describe('IronSession tests', () => {
    it('should set and get a value in the session', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'ddmlab',
                password: 'secret'
            }
        });
        const session: IronSession = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })
        expect(session.user).toBeUndefined();
        
        await setEmptySession(session, true)
        expect(session.user).toBeDefined();
        expect(session.allUsers).toHaveLength(1);

        session.user = {
            rucioIdentity: 'ddmlab',
            rucioAccount: 'root',
            rucioAuthToken: 'rucio-ddmlab-askdjljioj',
            rucioAuthTokenExpires: '2021-09-01T12:00:00Z',
            rucioAuthType: 'userpass',
            rucioOIDCProvider: 'cern',
            rucioVO: 'def',
            isLoggedIn: true
        }
        await session.save();
        expect(session.user).toHaveProperty('rucioIdentity');
        expect(session.user?.rucioIdentity).toBe('ddmlab');
        expect(session.user).toHaveProperty('rucioAuthToken');
        expect(session.user?.rucioAuthToken).toBe('rucio-ddmlab-askdjljioj');
        expect(session.user).toHaveProperty('rucioAccount');
        expect(session.user?.rucioAccount).toBe('root');
        expect(session.user).toHaveProperty('isLoggedIn');
        expect(session.user?.isLoggedIn).toBe(true);
        
    });

    it('should add a new, update and delete user to/from the session', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'ddmlab',
                password: 'secret'
            }
        });
        const session: IronSession = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })

        session.allUsers = [];
        
        const sessionUserPassDDMLab: SessionUser = {
            rucioAuthToken: 'rucio-ddmlab-adadadad',
            rucioAuthTokenExpires: '2021-09-01T12:00:00Z',
            rucioAccount: 'root',
            rucioIdentity: 'ddmlab',
            rucioAuthType: 'userpass',
            rucioVO: 'def',
            rucioOIDCProvider: null,
            isLoggedIn: true
        }

        const sessionUserX509DDMLab: SessionUser = {
            rucioAuthToken: 'rucio-ddmlab-adasfgdbg',
            rucioAuthTokenExpires: '2022-10-01T12:00:00Z',
            rucioAccount: 'root',
            rucioIdentity: 'ddmlab',
            rucioAuthType: 'x509',
            rucioVO: 'def',
            rucioOIDCProvider: null,
            isLoggedIn: true
        }

        await addOrUpdateSessionUser(session, sessionUserPassDDMLab);
        expect(session.allUsers).toHaveLength(1);

        await addOrUpdateSessionUser(session, sessionUserX509DDMLab);
        expect(session.allUsers).toHaveLength(2);

        sessionUserX509DDMLab.rucioAuthTokenExpires = '2021-11-01T12:00:00Z';
        await addOrUpdateSessionUser(session, sessionUserX509DDMLab);
        expect(session.allUsers).toHaveLength(2);
        expect(session.allUsers[1].rucioAuthTokenExpires).toBe('2021-11-01T12:00:00Z');

        await removeSessionUser(session, sessionUserX509DDMLab);
        expect(session.allUsers).toHaveLength(1);
    });

    it('should manage an active session user', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'ddmlab',
                password: 'secret'
            }
        });
        const session: IronSession = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })
        const sessionUserPassDDMLab: SessionUser = {
            rucioAuthToken: 'rucio-ddmlab-adadadad',
            rucioAuthTokenExpires: '2021-09-01T12:00:00Z',
            rucioAccount: 'root',
            rucioIdentity: 'ddmlab',
            rucioAuthType: 'userpass',
            rucioOIDCProvider: null,
            rucioVO: 'def',
            isLoggedIn: true
        }

        const autreUser: SessionUser = {
            rucioAuthToken: 'rucio-autre-adagfdsfg',
            rucioAuthTokenExpires: '2022-11-01T12:00:00Z',
            rucioAccount: 'root',
            rucioIdentity: 'autre',
            rucioAuthType: 'userpass',
            rucioOIDCProvider: null,
            rucioVO: 'def',
            isLoggedIn: true
        }

        await setActiveSessionUser(session, sessionUserPassDDMLab);
        expect(session.user?.rucioAuthToken).toBe('rucio-ddmlab-adadadad');

        await setActiveSessionUser(session, autreUser);
        expect(session.user?.rucioAuthToken).toBe('rucio-autre-adagfdsfg');
        expect(session.allUsers).toHaveLength(2);

        await removeSessionUser(session, sessionUserPassDDMLab);
        expect(session.user?.rucioAccount).toBe('root');
        expect(session.allUsers).toHaveLength(1);

        await removeSessionUser(session, autreUser);
        expect(session.user).toBeUndefined();
        expect(session.allUsers).toHaveLength(0);

    });
})