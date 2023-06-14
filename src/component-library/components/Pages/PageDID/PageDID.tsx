// components
import { DIDMetaView } from "@/component-library/components/Pages/ListDID/DIDMetaView";
import { Tabs } from "../../Tabs/Tabs";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { H3 } from "../../Text/Headings/H3";
import { SubPage } from "../../Helpers/SubPage";

// misc packages, react
import { twMerge } from "tailwind-merge";
import React, { useEffect, useState } from "react";
import { HiArrowCircleLeft } from "react-icons/hi";
import { FetchStatus } from "@tanstack/react-query";

// DTO etc
import { DIDMeta, DIDType } from "@/lib/core/entity/rucio";
import { DIDSearchQuery } from "@/lib/infrastructure/data/view-model/create-rule";
import { PageDIDMetadata } from "./PageDIDMetadata";
import { PageDIDFilereplicas } from "./PageDIDFilereplicas";
import { PageDIDFilereplicasD } from "./PageDIDFilereplicasD";
import { PageDIDRules } from "./PageDIDRules";
import { DIDContents } from "@/lib/infrastructure/data/view-model/page-did";
import { PageDIDByType } from "./PageDIDByType";
import { PageDIDDatasetReplicas } from "./PageDIDDatasetReplicas";

export interface PageDIDPageProps {
    didMeta: DIDMeta;
    fromDidList?: string; // if coming from DIDList, this will be the DIDList's query
    // Parent DIDs [FILE]
    didParentsSearch: (didSearchQuery: DIDSearchQuery) => void
    didParentsResponse: { data: any; fetchStatus: FetchStatus }
    // Metadata [BOTH]
    didMetadataSearch: (didSearchQuery: DIDSearchQuery) => void
    didMetadataResponse: { data: any; fetchStatus: FetchStatus }
    // File Replica States [FILE]
    didFileReplicasSearch: (didSearchQuery: DIDSearchQuery) => void
    didFileReplicasResponse: { data: any; fetchStatus: FetchStatus }
    // File Replica States [DATASET]
    didFileReplicasDatasetSearch: (didSearchQuery: DIDSearchQuery) => void
    didFileReplicasDatasetResponse: { data: any; fetchStatus: FetchStatus }
    // Rule State [DATASET]
    didRulesSearch: (didSearchQuery: DIDSearchQuery) => void
    didRulesResponse: { data: any; fetchStatus: FetchStatus }
    // Contents [COLLECTION]
    didContentsSearch: (didSearchQuery: DIDSearchQuery) => void
    didContentsResponse: { data: DIDContents[]; fetchStatus: FetchStatus }
    // Dataset Replica States [DATASET]
    didDatasetReplicasSearch: (didSearchQuery: DIDSearchQuery) => void
    didDatasetReplicasResponse: { data: any; fetchStatus: FetchStatus }
}



export const PageDID = (
    props: PageDIDPageProps
) => {
    const [subpageIndex, setSubpageIndex] = useState<number>(0)
    const didtype = props.didMeta.did_type
    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full"
            )}
        >
            <div
                className={twMerge(
                    "rounded-md w-full",
                    "border dark:border-2 dark:border-gray-200 p-2",
                    "flex flex-col items-start space-y-2",
                    "bg-white dark:bg-gray-800"
                )}
            >
                <div
                    className={twMerge(
                        "flex flex-col space-y-2 lg:flex-row lg:justify-between lg:items-baseline lg:space-y-0 w-full",
                        "bg-white dark:bg-gray-800"
                    )}
                >
                    <span className="flex flex-row justify-between space-x-4">
                        <H3>DID Page for {props.didMeta.scope}:{props.didMeta.name}</H3>
                        <DIDTypeTag didtype={props.didMeta.did_type} />
                    </span>
                    <a
                        className={twMerge(
                            props.fromDidList ? "flex" : "hidden",
                            "bg-blue-500 hover:bg-blue-600 text-white",
                            "py-1 px-3 h-8 rounded",
                            "font-bold",
                            "cursor-pointer",
                            "flex-row justify-center lg:justify-end items-center space-x-2 shrink-0"
                        )}
                        href={props.fromDidList ? "/listdids?=" + props.fromDidList : "/"} // TODO connect properly
                        id="back-to-didlist-button"
                    >
                        <HiArrowCircleLeft className="text-xl" />
                        <label className="cursor-pointer" htmlFor="back-to-didlist-button">
                            Back to DID List
                        </label>
                    </a>
                </div>
                <div
                    className={twMerge(
                        "bg-stone-100 dark:bg-gray-900",
                        "rounded-md p-2",
                        "flex flex-col space-y-2",
                        "min-h-0 w-full"
                    )}
                >
                    <DIDMetaView data={props.didMeta} show horizontal />
                </div>
            </div>

            <div
                className={twMerge(
                    "min-w-0",
                    "lg:col-span-2",
                    "flex flex-col",
                    "rounded-md p-2 border"
                )}
            >
                <Tabs
                    tabs={
                        didtype === DIDType.File ? ["File Replica States", "Parent DIDs", "Metadata"] :
                            (didtype === DIDType.Dataset ? ["Rules", "Dataset Replicas", "File Replica States", "Metadata"] :
                                ["Contents", "Rules", "Metadata"]
                            )
                    } // remember difference between collections and files
                    active={0}
                    updateActive={(id: number) => { setSubpageIndex(id) }}
                />
                <SubPage
                    show={didtype === DIDType.File ? false : didtype === DIDType.Dataset ? subpageIndex === 0 : subpageIndex === 1}
                    id="subpage-rules"
                >
                    <PageDIDRules tableData={{
                        data: props.didRulesResponse.data,
                        fetchStatus: props.didRulesResponse.fetchStatus,
                        pageSize: 10
                    }}
                    />
                </SubPage>
                <SubPage
                    show={didtype === DIDType.File ? false : didtype === DIDType.Dataset ? subpageIndex === 1 : false}
                    id="subpage-dataset-replicas"
                >
                    <PageDIDDatasetReplicas tableData={{
                        data: props.didDatasetReplicasResponse.data,
                        fetchStatus: props.didDatasetReplicasResponse.fetchStatus,
                        pageSize: 10
                    }} />
                </SubPage>
                <SubPage
                    show={didtype === DIDType.File ? subpageIndex === 0 : didtype === DIDType.Dataset ? subpageIndex === 2 : false}
                    id="subpage-file-replica-states"
                >
                    <div className={twMerge(didtype === DIDType.File ? "block" : "hidden")}>
                        <PageDIDFilereplicas tableData={{
                            data: props.didFileReplicasResponse.data,
                            fetchStatus: props.didFileReplicasResponse.fetchStatus,
                            pageSize: 10
                        }}
                        />
                    </div>
                    <div className={twMerge(didtype === DIDType.Dataset ? "block" : "hidden")}>
                        <PageDIDFilereplicasD
                            replicaTableData={{
                                data: props.didFileReplicasResponse.data,
                                fetchStatus: props.didFileReplicasResponse.fetchStatus,
                                pageSize: 10
                            }}
                            datasetTableData={{
                                data: props.didFileReplicasDatasetResponse.data,
                                fetchStatus: props.didFileReplicasDatasetResponse.fetchStatus,
                                pageSize: 10
                            }}
                            onChangeDatasetSelection={(dataset: string) => { console.log("datasetSelection", dataset) }}
                        />

                    </div>
                </SubPage>
                <SubPage
                    show={didtype === DIDType.File ? subpageIndex === 1 : false}
                    id="subpage-parent-dids"
                >
                    <PageDIDByType tableData={{
                        data: props.didParentsResponse.data,
                        fetchStatus: props.didParentsResponse.fetchStatus,
                        pageSize: 10
                    }} />
                </SubPage>
                <SubPage
                    show={didtype === DIDType.File ? subpageIndex === 2 : didtype === DIDType.Dataset ? subpageIndex === 3 : subpageIndex === 2}
                    id="subpage-metadata"
                >
                    <PageDIDMetadata tableData={{
                        data: props.didMetadataResponse.data,
                        fetchStatus: props.didMetadataResponse.fetchStatus,
                        pageSize: 10
                    }} />
                </SubPage>
                <SubPage
                    show={didtype === DIDType.Container ? subpageIndex === 0 : false}
                    id="subpage-contents"
                >
                    <PageDIDByType showDIDType tableData={{
                        data: props.didContentsResponse.data,
                        fetchStatus: props.didContentsResponse.fetchStatus,
                        pageSize: 10
                    }} />
                </SubPage>

            </div>
        </div>
    )
}