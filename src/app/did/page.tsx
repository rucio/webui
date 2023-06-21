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
import { createDID, createDIDDatasetReplicas, createDIDMeta, createDIDRules, createFileReplicaState, createFileReplicaStateD, mockUseComDOM } from 'test/fixtures/table-fixtures';


export default function PageDID() {
    const didMeta =  createDIDMeta()
    const fromDidList =  "yosearch"
    const didParentsComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => createDID()))
    const didMetadataComDOM = mockUseComDOM([
        { key: "bernd", value: "das brot" },
        { key: "kika", value: "der sender" },
        { key: "kikaninchen", value: "das tier" },
        { key: "my birthday", value: new Date(2021, 3) },
        { key: "am_i_anton", value: false },
        { key: "R1-tastefactor", value: 3.142 },
        { key: "hello", value: null },
    ])
    const didFileReplicasComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => createFileReplicaState()))
    const didFileReplicasDComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => createFileReplicaStateD()))
    const didRulesComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => createDIDRules()))
    const didContentsComDOM = mockUseComDOM(Array.from({ length: 100 }, (_, i) => createDID()))
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