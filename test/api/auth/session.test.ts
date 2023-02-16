import { setEmptySession } from "@/lib/infrastructure/auth/session-utils";
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
        
        session.user = {
            rucioIdentity: 'ddmlab',
            rucioAccount: 'root',
            rucioAuthToken: 'rucio-ddmlab-askdjljioj',
            rucioAuthType: 'userpass',
            rucioOIDCProvider: 'cern',
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

})