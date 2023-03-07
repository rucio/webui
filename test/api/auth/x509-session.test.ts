import { setEmptySession } from "@/lib/infrastructure/auth/session-utils";
import { getIronSession } from "iron-session";
import { createMocks } from "node-mocks-http";
import x509Route from "@/pages/api/auth/x509";

describe('X509Login API Test', () => {
    it('should set session user upon successful login via x509 workflow', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                rucioAccount: 'root',
                rucioAuthToken: 'rucio-ddmlab-askdjljioj'
            }
        });
        const session = await getIronSession(req, res, {
            password: 'passwordpasswordpasswordpasswordpassword',
            cookieName: 'test-request-session',
            cookieOptions: {
                secure: false,
            },
        })
        req.session = session
        await setEmptySession(session, true)
        await x509Route(req, res)
        expect(req.session.user?.rucioAuthToken).toBe('rucio-ddmlab-askdjljioj');
        expect(req.session.user?.rucioAccount).toBe('root');
    })
})