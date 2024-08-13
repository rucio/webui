import { DIDKeyValuePairsDataViewModel, DIDMetaViewModel } from "@/lib/infrastructure/data/view-model/did";

export async function didMetaQueryBase(scope: string, name: string): Promise<DIDMetaViewModel> {
    const url = '/api/feature/get-did-meta?' + new URLSearchParams({scope, name})
    const res = await fetch(url)
    return await res.json()
}

export async function didKeyValuePairsDataQuery(scope: string, name: string): Promise<DIDKeyValuePairsDataViewModel> {
    const url = '/api/feature/get-did-keyvaluepairs?' + new URLSearchParams({scope, name})
    const res = await fetch(url)
    return await res.json()
}