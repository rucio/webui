import { RSEAttributeViewModel, RSEProtocolViewModel, RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";

export async function getRSE(rseName: string): Promise<RSEViewModel> {
    const url = `${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-rse?` + new URLSearchParams({rseName})
    const res = await fetch(url)
    return await res.json()
}

export async function getProtocols(rseName: string): Promise<RSEProtocolViewModel> {
    const url = `${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-rse-protocols?` + new URLSearchParams({rseName})
    const res = await fetch(url)
    return await res.json()
}

export async function getAttributes(rseName:string): Promise<RSEAttributeViewModel> {
    const url = `${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-rse-attributes?` + new URLSearchParams({rseName})
    const res = await fetch(url)
    return await res.json()
}
