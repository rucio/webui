import { DIDKeyValuePairsDataViewModel, DIDMetaViewModel } from "@/lib/infrastructure/data/view-model/did";

export async function didMetaQueryBase(scope: string, name: string): Promise<DIDMetaViewModel> {
    const req: any = {
        method: "GET",
        url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-did-meta`),
        params: {
            "scope": scope,
            "name": name
        },
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit)
    }

    const res = await fetch(req.url, {
        method: "GET",
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit)
    })

    return await res.json()
}

export async function didKeyValuePairsDataQuery(scope: string, name: string): Promise<DIDKeyValuePairsDataViewModel> {
    const req: any = {
        method: "GET",
        url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-did-keyvaluepairs`),
        params: {
            "scope": scope,
            "name": name
        },
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit)
    }

    const res = await fetch(req.url, {
        method: "GET",
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit)
    })

    return await res.json()
}