'use client';
import { PageDID as PageDIDStory } from '@/component-library/Pages/DID/PageDID';
import useComDOM from '@/lib/infrastructure/hooks/useComDOM';
import { useEffect, useState } from 'react';
import {
    fixtureDIDDatasetReplicasViewModel,
    fixtureDIDKeyValuePairsDataViewModel,
    fixtureDIDMetaViewModel,
    fixtureDIDRulesViewModel,
    mockUseComDOM,
} from 'test/fixtures/table-fixtures';
import { HTTPRequest } from '@/lib/sdk/http';
import {
    DIDDatasetReplicasViewModel,
    DIDKeyValuePairsDataViewModel,
    DIDMetaViewModel,
    DIDRulesViewModel,
    DIDViewModel,
    FilereplicaStateDViewModel,
    FileReplicaStateViewModel,
} from '@/lib/infrastructure/data/view-model/did';
import { didKeyValuePairsDataQuery, didMetaQueryBase } from '@/app/(rucio)/did/queries';
import { Loading } from '@/component-library/Pages/Helpers/Loading';

export default function Page({ params }: { params: { scope: string; name: string } }) {
    const [didMeta, setDIDMeta] = useState<DIDMetaViewModel>({ status: 'pending' } as DIDMetaViewModel);
    const [didKeyValuePairsData, setDIDKeyValuePairsData] = useState({ status: 'pending' } as DIDKeyValuePairsDataViewModel);
    const [fromDidList, setFromDidList] = useState<string>('yosearch');
    useEffect(() => {
        didMetaQueryBase(params.scope, params.name).then(setDIDMeta);
    }, []);
    useEffect(() => {
        didKeyValuePairsDataQuery(params.scope, params.name).then(setDIDKeyValuePairsData);
    }, []);

    const didParentsComDOM = useComDOM<DIDViewModel>('page-did-parents-query', [], false, Infinity, 200, true);
    const didContentsComDOM = useComDOM<DIDViewModel>('page-did-contents-query', [], false, Infinity, 200, true);
    const didFileReplicasComDOM = useComDOM<FileReplicaStateViewModel>('page-did-filereplicas-query', [], false, Infinity, 200, true);
    const didFileReplicasDOnChange = (scope: string, name: string) => {
        didFileReplicasComDOM.setRequest({
            url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-file-replicas`),
            method: 'GET',
            params: {
                scope: scope,
                name: name,
            },
            headers: new Headers({
                'Content-Type': 'application/json',
            } as HeadersInit),
            body: null,
        } as HTTPRequest);
        didFileReplicasComDOM.start();
    };
    const didRulesComDOM = useComDOM<DIDRulesViewModel>('page-did-rules-query', [], false, Infinity, 200, true);
    const didDatasetReplicasComDOM = useComDOM<DIDDatasetReplicasViewModel>('page-did-datasetreplicas-query', [], false, Infinity, 200, true);
    useEffect(() => {
        const setRequests = async () => {
            await didContentsComDOM.setRequest({
                url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-did-contents`),
                method: 'GET',
                params: {
                    scope: params.scope,
                    name: params.name,
                },
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            } as HTTPRequest);
            await didParentsComDOM.setRequest({
                url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-did-parents`),
                method: 'GET',
                params: {
                    scope: params.scope,
                    name: params.name,
                },
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            } as HTTPRequest);
            await didFileReplicasComDOM.setRequest({
                url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-file-replicas`),
                method: 'GET',
                params: {
                    scope: params.scope,
                    name: params.name,
                },
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            } as HTTPRequest);
            await didRulesComDOM.setRequest({
                url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-did-rules`),
                method: 'GET',
                params: {
                    scope: params.scope,
                    name: params.name,
                },
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            } as HTTPRequest);
            await didDatasetReplicasComDOM.setRequest({
                url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-dataset-replicas`),
                method: 'GET',
                params: {
                    scope: params.scope,
                    name: params.name,
                },
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            } as HTTPRequest);
        };
        setRequests();
    }, []);
    if (didMeta.status === 'pending') {
        return <Loading title="View DID" subtitle={`For DID ${params.scope}:${params.name}`} />;
    }
    return (
        <PageDIDStory
            didMeta={didMeta}
            fromDidList={fromDidList}
            didParentsComDOM={didParentsComDOM}
            didKeyValuePairsData={didKeyValuePairsData}
            didFileReplicasComDOM={didFileReplicasComDOM}
            didFileReplicasDOnChange={didFileReplicasDOnChange}
            didRulesComDOM={didRulesComDOM}
            didContentsComDOM={didContentsComDOM}
            didDatasetReplicasComDOM={didDatasetReplicasComDOM}
        />
    );
}
