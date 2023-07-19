import { DID } from "@/lib/core/entity/rucio";

export function didToScopename(list: DID[]): string[] {
    return list.map(did => did.scope + ":" + did.name)
}