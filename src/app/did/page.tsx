'use client';
import { PageDID as PageDIDStory } from '@/component-library/components/Pages/PageDID/PageDID';
import { DIDMeta } from "@/lib/core/entity/rucio";
import {
    CreateRuleQuery, DIDSearchQuery, DIDSearchResponse, DIDName,
    TypedDIDValidationQuery, TypedDIDValidationResponse,
    RSESearchQuery
} from '@/lib/infrastructure/data/view-model/create-rule'
import { DIDContents, FilereplicaState, FilereplicaStateD } from '@/lib/infrastructure/data/view-model/page-did';
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { FetchStatus } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import { createDID, createDIDDatasetReplicas, createDIDMeta, createDIDRules, createFileReplicaState, createFileReplicaStateD, mockUseComDOM } from 'test/fixtures/table-fixtures';
import { DID } from '@/lib/core/entity/rucio';
import { HTTPRequest } from '@/lib/infrastructure/web-worker/comdom-wrapper';


export default function PageDID() {
    const [didMeta, setDIDMeta] = useState<DIDMeta>({} as DIDMeta)
    const [fromDidList, setFromDidList] = useState<string>("yosearch")
    useEffect(() => {
        setDIDMeta(createDIDMeta())
    }, [])

    const didParentsComDOM = useComDOM<DID>(
        'page-did-parents-query',
        [],
        false,
        Infinity,
        200,
        true
    )
    const didContentsComDOM = useComDOM<DID>(
        'page-did-contents-query', [], false, Infinity, 200, true
    )
    const didFileReplicasComDOM = useComDOM<FilereplicaState>(
        'page-did-filereplicas-query', [], false, Infinity, 200, true
    )
    const didFileReplicasDComDOM = useComDOM<FilereplicaStateD>(
        'page-did-filereplicas-d-query', [], false, Infinity, 200, true
    )
    useEffect(() => {
        const setRequests = async () => {
            const requestParents: HTTPRequest = {
                url: new URL('http://localhost:3000/api/listdids'),
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            }
            await didParentsComDOM.setRequest(requestParents)
            const requestContents: HTTPRequest = {
                url: new URL('http://localhost:3000/api/listdids'),
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            }
            await didContentsComDOM.setRequest(requestContents)
            const requestsFilereplicas: HTTPRequest = {
                url: new URL('http://localhost:3000/api/filereplicastate'),
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            }
            await didFileReplicasComDOM.setRequest(requestsFilereplicas)
            const requestsFilereplicasD: HTTPRequest = {
                url: new URL('http://localhost:3000/api/filereplicastate-d'),
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            }
            await didFileReplicasDComDOM.setRequest(requestsFilereplicasD)
        }
        setRequests()
    }, [])
    const didMetadataComDOM = mockUseComDOM([
        { key: "bernd", value: "das brot" },
        { key: "kika", value: "der sender" },
        { key: "kikaninchen", value: "das tier" },
        { key: "my birthday", value: new Date(2021, 3) },
        { key: "am_i_anton", value: false },
        { key: "R1-tastefactor", value: 3.142 },
        { key: "hello", value: null },
    ])
    const didRulesComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => createDIDRules()))
    const didDatasetReplicasComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => createDIDDatasetReplicas()))
    return (
        <PageDIDStory
            didMeta={didMeta}
            fromDidList={fromDidList}
            didParentsComDOM={didParentsComDOM}
            didMetadataComDOM={didMetadataComDOM}
            didFileReplicasComDOM={didFileReplicasComDOM}
            didFileReplicasDComDOM={didFileReplicasDComDOM}
            didRulesComDOM={didRulesComDOM}
            didContentsComDOM={didContentsComDOM}
            didDatasetReplicasComDOM={didDatasetReplicasComDOM}
        />
    )
}