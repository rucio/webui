import { RucioUser } from "@/lib/core/entity/auth-models";
import { unsealData } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next/dist";
import { NextApiHandler } from "next";
import { ReadonlyRequestCookies } from "next/dist/server/app-render";
import { sessionOptions } from "../config/session";

/**
 * Returns the {@link Ruciouser} object from the iron session
 * @param cookies {@link ReadOnlyRequestCookies} from the iron session object
 * @returns {@link RucioUser} object or null
 */
export const getRucioUserFromSession = async(
    cookies: ReadonlyRequestCookies,
): Promise<RucioUser | undefined> => {
    const cookieName = process.env.NEXT_SESSION_COOKIE_NAME as string || "rucio_webui_session";
    const cookie = cookies.get(cookieName);
    if (!cookie) return new Promise<RucioUser | undefined>(resolve => resolve(undefined));

    const user = await unsealData<RucioUser>(cookie.value, {
        password: process.env.SESSION_PASSWORD as string,
    })
    return new Promise<RucioUser | undefined>(resolve => resolve(user));
}


/**
 * Get the rucioAuthToken from the {@link RucioUser} object in the iron session
 * @param cookies {@link ReadOnlyRequestCookies} from the iron session object
 * @returns rucioAuthToken for the current {@link RucioUser} or an empty string
 */
export const getRucioAuthToken =async (cookies:ReadonlyRequestCookies): Promise<string> => {
    const rucioUser = await getRucioUserFromSession(cookies);
    if (!rucioUser) return new Promise<string>(resolve => resolve(""));
    return new Promise<string>(resolve => resolve(rucioUser.rucioAuthToken));
}


/**
 * Makes a iron session available to a NEXT.js API route via its req.session.user property
 * @param handler {@link NextApiHandler} or a NEXT.js API route
 * @returns wrapped {@link NextApiHandler} or a NEXT.js API route
 */
export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, sessionOptions);
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
