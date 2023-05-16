import { getIronSession } from "iron-session";
import { createMocks } from "node-mocks-http";

export async function createHttpMocks(url?: string, method?: 'GET' | 'POST', body: any = {}){
    const { req, res } = createMocks({
        url: url? url: 'http://testhost:3000/',
        method: method? method: 'GET',
        body: body,
    });
    const session = await getIronSession(req, res, {
        password: 'passwordpasswordpasswordpasswordpassword',
        cookieName: 'test-request-session',
        cookieOptions: {
            secure: false,
        },
    })
    return { req, res, session }
}