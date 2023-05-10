// components
import { DIDMetaView } from "@/component-library/components/Pages/ListDID/DIDMetaView";
import { Tabs } from "../../Tabs/Tabs";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { H3 } from "../../Text/Headings/H3";

// misc packages, react
import { twMerge } from "tailwind-merge";
import React, { useEffect, useState } from "react";
import { HiArrowCircleLeft } from "react-icons/hi";
import { FetchStatus } from "@tanstack/react-query";

// DTO etc
import { DIDMeta } from "@/lib/core/data/rucio-dto";
import { DIDSearchQuery } from "@/lib/infrastructure/data/view-model/createRule";
import { PageDIDParents } from "./PageDIDParents";
import { PageDIDMetadata } from "./PageDIDMetadata";
import { PageDIDFilereplicas } from "./PageDIDFilereplicas";
import { PageDIDFilereplicasD } from "./PageDIDFilereplicasD";

export interface PageDIDPageProps {
    didMeta: DIDMeta;
    fromDidList?: string; // if coming from DIDList, this will be the DIDList's query
    // Parent DIDs [FILE]
    didParentsSearch: (didSearchQuery: DIDSearchQuery) => void
    didParentsResponse: { data: any; fetchStatus: FetchStatus}
    // Metadata [BOTH]
    didMetadataSearch: (didSearchQuery: DIDSearchQuery) => void
    didMetadataResponse: { data: any; fetchStatus: FetchStatus}
    // File Replica States [FILE]
    didFileReplicasSearch: (didSearchQuery: DIDSearchQuery) => void
    didFileReplicasResponse: { data: any; fetchStatus: FetchStatus}
    // File Replica States [DATASET]
    didDatasetReplicasSearch: (didSearchQuery: DIDSearchQuery) => void
    didDatasetReplicasResponse: { data: any; fetchStatus: FetchStatus}
}

const SubPage: (
    React.FC<JSX.IntrinsicElements["div"] & { show: boolean; children?: any }>
) = (
    {
        show = false,
        ...allprops
    }
) => {
        const { className, children, ...props } = allprops
        return (
            <div
                className={twMerge(
                    show ? "block" : "hidden",
                    "grow rounded-b-md",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
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
                    "flex flex-col items-start space-y-2 md:flex-row md:justify-between md:items-end md:space-y-0",
                    "bg-white dark:bg-gray-800"
                )}
            >
                <span className="flex flex-row space-x-4">
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
                        "flex-row items-center space-x-2"
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
                    "flex flex-col lg:grid lg:grid-rows-1 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-2", // maybe use xl or even 2xl
                    "bg-white dark:bg-gray-800 border dark:border-gray-200 dark:border-2",
                    "p-2 rounded-lg"
                )}
            >
                <div
                    className={twMerge(
                        "min-w-0",
                        "lg:col-span-2",
                        "flex flex-col"
                    )}
                >
                    <Tabs
                        tabs={
                            didtype === "File" ? ["File Replica States", "Parent DIDs", "Metadata"] :
                                (didtype === "Dataset" ? ["Rules", "Dataset Replicas", "File Replica States", "Metadata"] :
                                    ["Contents", "Rules", "File Replica States", "Metadata"]
                                )
                        } // remember difference between collections and files
                        active={0}
                        handleClick={(event: any) => { console.log(event.target.dataset.id); setSubpageIndex(Number(event.target.dataset.id)) }}
                    />
                    <SubPage
                        show={didtype === "File" ? false : didtype === "Dataset" ? subpageIndex === 0 : subpageIndex === 1}
                        id="subpage-rules"
                    >
                        Rules
                    </SubPage>
                    <SubPage
                        show={didtype === "File" ? false : didtype === "Dataset" ? subpageIndex === 1 : false}
                        id="subpage-dataset-replicas"
                    >
                        Dataset Replicas
                    </SubPage>
                    <SubPage
                        show={didtype === "File" ? subpageIndex === 0 : didtype === "Dataset" ? subpageIndex === 2 : subpageIndex === 2}
                        id="subpage-file-replica-states"
                    >
                        <div className={twMerge( didtype === "File" ? "block" : "hidden")}>
                            <PageDIDFilereplicas tableData={{
                                data: props.didFileReplicasResponse.data,
                                fetchStatus: props.didFileReplicasResponse.fetchStatus,
                                pageSize: 10
                            }}
                            />
                        </div>
                        <div className={twMerge( didtype === "Dataset" ? "block" : "hidden")}>
                            <PageDIDFilereplicasD
                                replicaTableData={{
                                    data: props.didFileReplicasResponse.data,
                                    fetchStatus: props.didFileReplicasResponse.fetchStatus,
                                    pageSize: 10
                                }}
                                datasetTableData={{
                                    data: props.didDatasetReplicasResponse.data,
                                    fetchStatus: props.didDatasetReplicasResponse.fetchStatus,
                                    pageSize: 10
                                }}
                                onChangeDatasetSelection={(dataset: string) => { console.log("datasetSelection", dataset)}}
                            />

                        </div>
                    </SubPage>
                    <SubPage
                        show={didtype === "File" ? subpageIndex === 1 : false}
                        id="subpage-parent-dids"
                    >
                        <PageDIDParents tableData={{
                            data: props.didParentsResponse.data,
                            fetchStatus: props.didParentsResponse.fetchStatus,
                            pageSize: 10
                        }}/>
                    </SubPage>
                    <SubPage
                        show={didtype === "File" ? subpageIndex === 2 : didtype === "Dataset" ? subpageIndex === 3 : subpageIndex === 3}
                        id="subpage-metadata"
                    >
                        <PageDIDMetadata tableData={{
                            data: props.didMetadataResponse.data,
                            fetchStatus: props.didMetadataResponse.fetchStatus,
                            pageSize: 10
                        }}/>
                    </SubPage>
                    <SubPage
                        show={didtype === "Container" ? subpageIndex === 0 : false}
                        id="subpage-contents"
                    >
                        Contents
                    </SubPage>

                </div>
                <div
                    className={twMerge(
                        "bg-stone-100 dark:bg-gray-900",
                        "rounded-md p-2",
                        "flex flex-col space-y-2",
                        "min-h-0"
                    )}
                >
                    <DIDMetaView data={props.didMeta} show />
                </div>
            </div>
        </div>
    )
}