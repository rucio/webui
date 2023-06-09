import { NextApiResponse } from "next";
import { PassThrough } from "stream";

/**
 * A type that represents a response object that can be used in a Next.js API route.
 * @remarks
 * This type can be either a `NextApiResponse` object or a `PassThrough` stream.
 */
export type TResponse = NextApiResponse | PassThrough