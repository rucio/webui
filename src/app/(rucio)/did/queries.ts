import { DIDKeyValuePairsDataViewModel, DIDMetaViewModel } from "@/lib/infrastructure/data/view-model/did";
import { HTTPRequest, prepareRequestArgs } from "@/lib/sdk/http";

export async function didMetaQueryBase(scope: string, name: string): Promise<DIDMetaViewModel> {
    const req: HTTPRequest = {
        method: "GET",
        url: new URL('http://localhost:3000/api/didmeta'),
        params: {
            "scope": scope,
            "name": name
        },
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit)
    }

    const { url, requestArgs } = prepareRequestArgs(req)
    const res = await fetch(url, {
        method: "GET",
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit)
    })

    return await res.json()
}

export async function didKeyValuePairsDataQuery(scope: string, name: string): Promise<DIDKeyValuePairsDataViewModel> {
    const req: HTTPRequest = {
        method: "GET",
        url: new URL('http://localhost:3000/api/didkeyvaluepairs'),
        params: {
            "scope": scope,
            "name": name
        },
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit)
    }

    const { url, requestArgs } = prepareRequestArgs(req)
    const res = await fetch(url, {
        method: "GET",
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit)
    })

    return await res.json()
}