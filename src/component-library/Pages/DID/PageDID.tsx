// components
import { DIDMetaView } from "./DIDMetaView";
import { Tabs } from "../../Misc/Tabs";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { SubPage } from "../../Helpers/SubPage";
import { Heading } from "../Helpers/Heading";
import { Body } from "../Helpers/Body";

// misc packages, react
import { twMerge } from "tailwind-merge";
import React, { useEffect, useState } from "react";

// DTO etc
import { DIDType } from "@/lib/core/entity/rucio";
import { PageDIDMetadata } from "./PageDIDMetadata";
import { PageDIDFilereplicas } from "./PageDIDFilereplicas";
import { PageDIDFilereplicasD } from "./PageDIDFilereplicasD";
import { PageDIDRules } from "./PageDIDRules";
import { PageDIDByType } from "./PageDIDByType";
import { PageDIDDatasetReplicas } from "./PageDIDDatasetReplicas";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { DIDDatasetReplicasViewModel, DIDKeyValuePairsDataViewModel, DIDMetaViewModel, DIDRulesViewModel, DIDViewModel, FilereplicaStateDViewModel, FilereplicaStateViewModel } from "@/lib/infrastructure/data/view-model/did";

export interface PageDIDPageProps {
    didMeta: DIDMetaViewModel;
    fromDidList?: string; // if coming from DIDList, this will be the DIDList's query
    // Parent DIDs [FILE]
    didParentsComDOM: UseComDOM<DIDViewModel>
    // Metadata [BOTH]
    didKeyValuePairsData: DIDKeyValuePairsDataViewModel
    // File Replica States [FILE]
    didFileReplicasComDOM: UseComDOM<FilereplicaStateViewModel>
    // File Replica States [DATASET]
    didFileReplicasDComDOM: UseComDOM<FilereplicaStateDViewModel>
    // Rule State [DATASET]
    didRulesComDOM: UseComDOM<DIDRulesViewModel>
    // Contents [COLLECTION]
    didContentsComDOM: UseComDOM<DIDViewModel>
    // Dataset Replica States [DATASET]
    didDatasetReplicasComDOM: UseComDOM<DIDDatasetReplicasViewModel>
}



export const PageDID = (
    props: PageDIDPageProps
) => {
    const didtype = props.didMeta.did_type
    const [subpageIndex, setSubpageIndex] = useState<number>(0)
    const showPageBools: Record<string, () => boolean> = {
        "subpage-metadata": () => {
            if (didtype === DIDType.FILE) {
                return subpageIndex === 2
            } else if (didtype === DIDType.DATASET) {
                return subpageIndex === 3
            } else if (didtype === DIDType.CONTAINER) {
                return subpageIndex === 2
            } else {
                return false
            }
        },
        "subpage-contents": () => {
            return didtype === DIDType.CONTAINER && subpageIndex === 0
        },
        "subpage-parent-dids": () => {
            return didtype === DIDType.FILE && subpageIndex === 1
        },
        "subpage-rules": () => {
            if (didtype === DIDType.DATASET) {
                return subpageIndex === 0
            } else if (didtype === DIDType.CONTAINER) {
                return subpageIndex === 1
            } else {
                return false
            }
        },
        "subpage-dataset-replicas": () => {
            return didtype === DIDType.DATASET && subpageIndex === 1
        },
        "subpage-file-replica-states": () => {
            return didtype === DIDType.FILE && subpageIndex === 0
        },
        "subpage-file-replica-states-d": () => {
            return didtype === DIDType.DATASET && subpageIndex === 2
        }
    }
    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full"
            )}
        >
            <Heading
                title="View DID"
                subtitle={`For DID ${props.didMeta.scope}:${props.didMeta.name}`}
                tag={<DIDTypeTag didtype={props.didMeta.did_type} />}
            >
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
            </Heading>

            <Body>
                <Tabs
                    tabs={
                        didtype === DIDType.FILE ? ["File Replica States", "Parent DIDs", "Metadata"] :
                            (didtype === DIDType.DATASET ? ["Rules", "Dataset Replicas", "File Replica States", "Metadata"] :
                                ["Contents", "Rules", "Metadata"]
                            )
                    } // remember difference between collections and files
                    active={0}
                    updateActive={(id: number) => { setSubpageIndex(id) }}
                />
                <SubPage
                    show={showPageBools["subpage-rules"]()}
                    id="subpage-rules"
                >
                    <PageDIDRules comdom={props.didRulesComDOM} />
                </SubPage>
                <SubPage
                    show={didtype === DIDType.FILE ? false : didtype === DIDType.DATASET ? subpageIndex === 1 : false}
                    id="subpage-dataset-replicas"
                >
                    <PageDIDDatasetReplicas comdom={props.didDatasetReplicasComDOM} />
                </SubPage>
                <SubPage
                    show={showPageBools["subpage-file-replica-states"]()}
                    run={() => { if (props.didFileReplicasComDOM.query.data.length === 0) { props.didFileReplicasComDOM.start() } }}
                    id="subpage-file-replica-states"
                >
                    <PageDIDFilereplicas comdom={props.didFileReplicasComDOM} />
                </SubPage>
                <SubPage
                    show={showPageBools["subpage-file-replica-states-d"]()}
                    run={() => { if (props.didFileReplicasDComDOM.query.data.length === 0) { props.didFileReplicasDComDOM.start() } }}
                    id="subpage-file-replica-states-d"
                >
                    <PageDIDFilereplicasD
                        replicaComDOM={props.didFileReplicasComDOM}
                        datasetComDOM={props.didFileReplicasDComDOM}
                        onChangeDatasetSelection={() => {
                            // TODO set query
                            // run query for file replicas
                        }}
                    />
                </SubPage>
                <SubPage
                    show={showPageBools["subpage-parent-dids"]()}
                    run={() => { if (props.didParentsComDOM.query.data.length === 0) { props.didParentsComDOM.start() } }}
                    id="subpage-parent-dids"
                >
                    <PageDIDByType comdom={props.didParentsComDOM} />
                </SubPage>
                <SubPage
                    show={showPageBools["subpage-metadata"]()}
                    id="subpage-metadata"
                >
                    <PageDIDMetadata tabledata={props.didKeyValuePairsData} />
                </SubPage>
                <SubPage
                    show={showPageBools["subpage-contents"]()}
                    run={() => { if (props.didContentsComDOM.query.data.length === 0) { props.didContentsComDOM.start() } }}
                    id="subpage-contents"
                >
                    <PageDIDByType showDIDType comdom={props.didContentsComDOM} />
                </SubPage>
            </Body>

        </div>
    )
}
