'use client';
import { ListDID as ListDIDStory } from "@/component-library/Pages/DID/ListDID";
import { DIDType } from "@/lib/core/entity/rucio";
import { DIDMetaViewModel, DIDViewModel } from "@/lib/infrastructure/data/view-model/did";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { HTTPRequest, prepareRequestArgs } from "@/lib/common/http";
import { useEffect, useState } from "react";
import { createDIDMeta } from "test/fixtures/table-fixtures";


export default function ListDID() {

    const [didMetaQueryResponse, setDIDMetaQueryResponse] = useState<DIDMetaViewModel>({} as DIDMetaViewModel)
    const didMetaQuery = async (scope: string, name: string) => {
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
        const {url, requestArgs} = prepareRequestArgs(req)
        console.log(url)
        const res = await fetch(url, {
            method: "GET",
            headers: new Headers({
                'Content-Type': 'application/json',
            } as HeadersInit)            
        })
        // console.log(await res.json())

        setDIDMetaQueryResponse({status: 'success', ... await res.json()})
    }

    const didQuery = async (query: string, type: DIDType) => {
        const request: HTTPRequest = {
            url: new URL('http://localhost:3000/api/dids'),
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            } as HeadersInit),
            body: {
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
    useEffect(() => {
        setDIDMetaQueryResponse({status: 'success', ...createDIDMeta()})
    }, [])
    useEffect(() => {
        const setRequest = async () => {
            const request: HTTPRequest = {
                url: new URL('http://localhost:3000/api/dids'),
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                params: {
                    "query": "test:*",
                    "type": DIDType.DATASET
                },
            }
            await DIDSearchComDOM.setRequest(request)
        }
        setRequest()
    }, [])
    return (
        <ListDIDStory
            comdom={DIDSearchComDOM}
            didQuery={didQuery}
            didMetaQuery={didMetaQuery}  // TODO: implement
            didMetaQueryResponse={didMetaQueryResponse}  // TODO: implement
        />
    )
}