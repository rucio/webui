'use client';
import { PageDID as PageDIDStory } from '@/component-library/Pages/DID/PageDID';
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { useEffect, useState } from "react";
import { fixtureDIDDatasetReplicasViewModel, fixtureDIDMetaViewModel, fixtureDIDRulesViewModel, mockUseComDOM, fixtureDIDKeyValuePairsViewModel } from 'test/fixtures/table-fixtures';
import { HTTPRequest } from "@/lib/sdk/http";
import { DIDMetaViewModel, DIDViewModel, FilereplicaStateDViewModel, FilereplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import { didMetaQueryBase } from '@/app/did/queries';

export default function Page({ params }: { params: { scope: string, name: string } }) {
    const [didMeta, setDIDMeta] = useState<DIDMetaViewModel>({} as DIDMetaViewModel)
    const [fromDidList, setFromDidList] = useState<string>("yosearch")
    useEffect(() => {
        didMetaQueryBase(params.scope, params.name).then(setDIDMeta)
    }, [])

    const didParentsComDOM = useComDOM<DIDViewModel>(
        'page-did-parents-query', [], false, Infinity, 200, true
    )
    const didContentsComDOM = useComDOM<DIDViewModel>(
        'page-did-contents-query', [], false, Infinity, 200, true
    )
    const didFileReplicasComDOM = useComDOM<FilereplicaStateViewModel>(
        'page-did-filereplicas-query', [], false, Infinity, 200, true
    )
    const didFileReplicasDComDOM = useComDOM<FilereplicaStateDViewModel>(
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
    const didMetadataComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => fixtureDIDKeyValuePairsViewModel()))
    const didRulesComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => fixtureDIDRulesViewModel()))
    const didDatasetReplicasComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => fixtureDIDDatasetReplicasViewModel()))
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