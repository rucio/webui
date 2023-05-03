import { DIDMeta } from "@/lib/core/data/rucio-dto"
import { DIDName, DIDSearchResponse, DIDSearchQuery } from "@/lib/infrastructure/data/view-model/createRule"

export interface ListDIDPageProps {
    didSearch: (didSearchQuery: DIDSearchQuery) => void,
    didResponse: DIDSearchResponse,
    didMetaQuery: (did: DIDName) => void,
    didMetaQueryResponse: DIDMeta,
}

export const ListDID = (
    props: ListDIDPageProps
) => {
    return (
        <div>
            <h1>ListDID</h1>
        </div>
    )
}