import { RSEAttributeViewModel, RSEProtocolViewModel, RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { HTTPRequest, prepareRequestArgs } from "@/lib/sdk/http";

export async function getRSE(rseName: string): Promise<RSEViewModel> {
    const req: HTTPRequest = {
        method: "GET",
        url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-rse`),
        params: {
            "rseName": rseName
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

export async function getProtocols(rseName: string): Promise<RSEProtocolViewModel> {
    const req: HTTPRequest = {
        method: "GET",
        url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-rse-protocols`),
        params: {
            "rseName": rseName
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

export async function getAttributes(rseName:string): Promise<RSEAttributeViewModel> {
    const req: HTTPRequest = {
        method: "GET",
        url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-rse-attributes`),
        params: {
            "rseName": rseName
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