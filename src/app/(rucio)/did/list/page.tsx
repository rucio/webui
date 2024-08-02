'use client';

import { ListDID as ListDIDStory } from "@/component-library/Pages/DID/ListDID";
import { DIDType } from "@/lib/core/entity/rucio";
import { DIDMetaViewModel, DIDViewModel } from "@/lib/infrastructure/data/view-model/did";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { useEffect, useState } from "react";
import { didMetaQueryBase } from "../queries";

export default function Page() {
    const [didMetaQueryResponse, setDIDMetaQueryResponse] = useState<DIDMetaViewModel>({status: "pending"} as DIDMetaViewModel)

    const didMetaQuery = async (scope: string, name: string) => {
        setDIDMetaQueryResponse(await didMetaQueryBase(scope, name))
    }
    const didQuery = async (query: string, type: DIDType) => {
        const request: any = {
            url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-dids`),
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
            } as HeadersInit),
            params: {
                "query": query,
                "type": type
            },

        }
        await DIDSearchComDOM.setRequest(request)
    }

    const DIDSearchComDOM = useComDOM<DIDViewModel>(
        'list-did-query',
        [],
        false,
        Infinity,
        200,
        true
    )
    return (
        <ListDIDStory
            comdom={DIDSearchComDOM}
            didQuery={didQuery}
            didMetaQuery={didMetaQuery}  // TODO: implement
            didMetaQueryResponse={didMetaQueryResponse}  // TODO: implement
        />
    )
}
