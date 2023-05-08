// components
import { DIDMetaView } from "@/component-library/components/Pages/ListDID/DIDMetaView";
import { Tabs } from "../../Tabs/Tabs";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { H3 } from "../../Text/Headings/H3";

// misc packages, react
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

// DTO etc
import { DIDMeta } from "@/lib/core/data/rucio-dto";
import { HiArrowCircleLeft } from "react-icons/hi";

export interface PageDIDPageProps {
    didMeta: DIDMeta;
    fromDidList?: string; // if coming from DIDList, this will be the DIDList's query
}

export const PageDID = (
    props: PageDIDPageProps
) => {
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
                    <HiArrowCircleLeft className="text-xl"/>
                    <label className="cursor-pointer" htmlFor="back-to-didlist-button">
                        Back to DID List
                    </label>
                </a>
            </div>
            <div
                className={twMerge(
                    "grid grid-rows-2 gap-y-2 lg:grid-rows-1 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-2", // maybe use xl or even 2xl
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
                        tabs={["Rules", "Dataset Replicas", "File Replica States"]}
                        active={0}
                        handleClick={(event: any) => { console.log(event) }}
                    />
                    <div
                        className={twMerge(
                            "grow",
                        )}
                    >
                        Content
                    </div>

                </div>
                <div
                    className={twMerge(
                        "bg-stone-100 dark:bg-gray-900",
                        "rounded-md p-2",
                        "flex flex-col space-y-2",
                    )}
                >
                    <DIDMetaView data={props.didMeta} show />
                </div>
            </div>
        </div>
    )
}