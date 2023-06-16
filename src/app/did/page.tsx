'use client';
import { PageDID as PageDIDStory } from '@/component-library/components/Pages/PageDID/PageDID';
import { DIDMeta } from "@/lib/core/entity/rucio";
import {
    CreateRuleQuery, DIDSearchQuery, DIDSearchResponse, DIDName,
    TypedDIDValidationQuery, TypedDIDValidationResponse,
    RSESearchQuery
} from '@/lib/infrastructure/data/view-model/create-rule'
import { DIDContents } from '@/lib/infrastructure/data/view-model/page-did';
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { FetchStatus } from '@tanstack/react-query';
import { useState } from "react";
import { createDID, createDIDDatasetReplicas, createDIDMeta, createDIDRules, createFileReplicaState, createFileReplicaStateD } from 'test/fixtures/table-fixtures';


export default function PageDID() {
    const props = {
        didMeta: createDIDMeta(),
        fromDidList: "yosearch",
        // Parent DIDs [FILE]
        didParentsSearch: (didSearchQuery: DIDSearchQuery) => { console.log(didSearchQuery) },
        didParentsResponse: {
            data: Array.from({length: 100}, (v, k) => createDID()),
            fetchStatus: "idle"
        } as {data: any; fetchStatus: FetchStatus},
        // DID Metadata
        didMetadataSearch: (didSearchQuery: DIDSearchQuery) => { console.log(didSearchQuery) },
        didMetadataResponse: {
            data: [
                { key: "bernd", value: "das brot" },
                { key: "kika", value: "der sender" },
                { key: "kikaninchen", value: "das tier" },
                { key: "my birthday", value: new Date(2021, 3) },
                { key: "am_i_anton", value: false },
                { key: "R1-tastefactor", value: 3.142 },
                { key: "hello", value: null },
            ],
            fetchStatus: "idle"
        } as {data: any; fetchStatus: FetchStatus},
        // Filereplicas
        didFileReplicasSearch: (didSearchQuery: DIDSearchQuery) => { console.log(didSearchQuery) },
        didFileReplicasResponse: {
            data: Array.from({length: 100}, (v, k) => createFileReplicaState()),
            fetchStatus: "idle"
        } as {data: any; fetchStatus: FetchStatus},
        didFileReplicasDatasetSearch: (didSearchQuery: DIDSearchQuery) => { console.log(didSearchQuery) },
        didFileReplicasDatasetResponse: {
            data: Array.from({length: 100}, (v, k) => createFileReplicaStateD()),
            fetchStatus: "idle"
        } as {data: any; fetchStatus: FetchStatus},
        didRulesSearch: (didSearchQuery: DIDSearchQuery) => { console.log(didSearchQuery) },
        didRulesResponse: {
            data: Array.from({length: 100}, (v, k) => createDIDRules()),
            fetchStatus: "idle"
        } as {data: any; fetchStatus: FetchStatus},
        // Contents
        didContentsSearch: (didSearchQuery: DIDSearchQuery) => { console.log(didSearchQuery) },
        didContentsResponse: {
            data: Array.from({length: 100}, (v, k) => createDID()),
            fetchStatus: "idle",
        } as {data: DIDContents[]; fetchStatus: FetchStatus},
        didDatasetReplicasSearch: (didSearchQuery: DIDSearchQuery) => { console.log(didSearchQuery) },
        didDatasetReplicasResponse: {
            data: Array.from({length: 100}, (v, k) => createDIDDatasetReplicas() ),
            fetchStatus: "idle"
        } as {data: any; fetchStatus: FetchStatus}
    }
    return (
        <PageDIDStory {...props} />
    )
}