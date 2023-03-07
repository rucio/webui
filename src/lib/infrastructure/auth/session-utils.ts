import { SessionUser } from "@/lib/core/entity/auth-models";
import { IronSession, unsealData } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { ReadonlyRequestCookies } from "next/dist/server/app-render";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import { sessionOptions } from "../config/session";

/**
 * Returns the {@link Ruciouser} object from the iron session
 * @param cookies {@link ReadOnlyRequestCookies} from the iron session object
 * @returns {@link RucioUser} object or null
 */
export const getSessionUser = async(
    cookies: ReadonlyRequestCookies,
): Promise<SessionUser | undefined> => {
    const cookieName = process.env.NEXT_SESSION_COOKIE_NAME as string || "rucio_webui_session";
    const cookie = cookies.get(cookieName);
    if (!cookie) return new Promise<SessionUser | undefined>(resolve => resolve(undefined));

    const sessionData = await unsealData<any>(cookie.value, {
        password: process.env.SESSION_PASSWORD as string,
    })
    return new Promise<SessionUser | undefined>(resolve => resolve(sessionData.user));
}


/**
 * Get the rucioAuthToken from the {@link SessionUser} object in the iron session
 * @param cookies {@link ReadonlyRequestCookies} from the iron session object
 * @returns rucioAuthToken for the current {@link SessionUser} or an empty string
 */
export const getRucioAuthToken = async (cookies: RequestCookies | ReadonlyRequestCookies): Promise<string> => {
    let readOnlyCookies = cookies as unknown as ReadonlyRequestCookies;
    const rucioUser = await getSessionUser(readOnlyCookies);
    if (!rucioUser) return new Promise<string>(resolve => resolve(""));
    const rucioAuthToken = rucioUser.rucioAuthToken;
    return Promise.resolve(rucioAuthToken);
}


/**
 * Makes a iron session available to a NEXT.js API route via its req.session.user property
 * @param handler {@link NextApiHandler} or a NEXT.js API route
 * @returns wrapped {@link NextApiHandler} or a NEXT.js API route
 */
export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}


/**
 * Set am empty {@link SessionUser} object in the iron session if login fails
 * @param session The {@link IronSession} object
 * @param saveSession If true, the session will be saved
 */
export async function setEmptySession(session: IronSession, saveSession: boolean = true) {
    session.user = {
        rucioIdentity: '',
        rucioAccount: '',
        rucioAuthType: null,
        rucioAuthToken: '',
        rucioAuthTokenExpires: '',
        rucioOIDCProvider: null,
        isLoggedIn: false,
    }
    saveSession ? await session.save() : null;
}

// /**
//  * 
//  * @param host 
//  * @param path 
//  * @param method 
//  * @param body 
//  * @returns 
//  */
// export const authenticatedFetch = async (
//     host: string | undefined = process.env.NEXT_RUCIO_HOST,
//     path: string,
//     method: string = "GET",
//     body?: string | [] | undefined, 
//     cookies: ReadonlyRequestCookies,
//     excludeAuthHeaders: boolean = false,
// ) => {

//     const rucioAuthToken = await getRucioAuthToken(cookies);
//     if(rucioAuthToken.length === 0) {
//         throw new Error("No rucioAuthToken found in the session");
//     }
//     try {
//         const response = await fetch(
//             `${host}${path}`,

//         )
//     }
    
//     const token = await getAccessToken();
//     return fetch('https://api.spotify.com/v1/me', {
//         headers: {
//         Authorization: `Bearer ${token}`,
//         },
//     });
//     };
