import { DateISO, RSE, RSEBlockState } from "@/lib/core/entity/rucio";
import { H1 } from "../../Text/Headings/H1";
import { twMerge } from "tailwind-merge";
import { Generaltable } from "../../Helpers/Metatable";
import { Titleth, Contenttd } from "../../Helpers/Metatable";
import { BoolTag } from "../../Tags/BoolTag";
import { RSETypeTag } from "../../Tags/RSETypeTag";
import { RSETag } from "../../Tags/RSETag";
import { HiArrowCircleLeft } from "react-icons/hi";
import { RSEAttribute, RSEProtocol } from "@/lib/infrastructure/data/view-model/rse";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { PageRSEProtocols } from "./PageRSEProtocols";
import { PageRSEAttributes } from "./PageRSEAttributes";
import { H2 } from "../../Text/Headings/H2";

type PageRSEProps = {
    rse: RSE
    rseblockstate: RSEBlockState
    protocolscomdom: UseComDOM<RSEProtocol>
    attributescomdom: UseComDOM<RSEAttribute>
    fromrselist?: boolean
}

export const PageRSE = (
    props: PageRSEProps
) => {
    return (
        <div
            className={twMerge("flex flex-col space-y-2 w-full")}
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
                        "flex w-full",
                        "flex-col space-y-2 md:space-y-0 justify-start",
                        "md:flex-row md:justify-between space-x-2"
                    )}
                >
                    <H1>RSE Page for {props.rse.name}</H1>
                    <a
                        className={twMerge(
                            props.fromrselist ? "flex" : "hidden",
                            "bg-blue-500 hover:bg-blue-600 text-white",
                            "py-1 px-3 h-8 rounded",
                            "font-bold",
                            "cursor-pointer",
                            "flex-row justify-center lg:justify-end items-center space-x-2 shrink-0"
                        )}
                        href={props.fromrselist ? "/listdids?=" + props.fromrselist: "/"} // TODO connect properly
                        id="back-to-rselist-button"
                    >
                        <HiArrowCircleLeft className="text-xl" />
                        <label className="cursor-pointer" htmlFor="back-to-rselist-button">
                            Back to RSE List
                        </label>
                    </a>
                </div>

                <div
                    className={twMerge(
                        "bg-stone-100 dark:bg-gray-900",
                        "rounded-md p-2",
                        "grid grid-cols-1 md:grid-cols-2 gap-2",
                        "min-h-0 w-full"
                    )}
                >
                    <Generaltable>
                        <tr>
                            <Titleth>Name</Titleth>
                            <Contenttd>{props.rse.name}</Contenttd>
                        </tr>
                        <tr>
                            <Titleth>RSE Type</Titleth>
                            <Contenttd><RSETypeTag rsetype={props.rse.rse_type} /></Contenttd>
                        </tr>
                        <tr>
                            <Titleth>Availability</Titleth>
                            <Contenttd><RSETag blocked={props.rseblockstate} /></Contenttd>
                        </tr>
                    </Generaltable>
                    <Generaltable>
                        <tr>
                            <Titleth>Volatile</Titleth>
                            <Contenttd><BoolTag val={props.rse.volatile} /></Contenttd>
                        </tr>
                        <tr>
                            <Titleth>Deterministic</Titleth>
                            <Contenttd><BoolTag val={props.rse.deterministic} /></Contenttd>
                        </tr>
                        <tr>
                            <Titleth>Staging Area</Titleth>
                            <Contenttd><BoolTag val={props.rse.staging_area} /></Contenttd>
                        </tr>
                    </Generaltable>
                </div>
            </div>
            <div
                className={twMerge(
                    "flex flex-col space-y-2 w-full",
                    "p-0 md:p-2",
                    "rounded-md border",
                    "bg-white dark:bg-gray-800",
                )}
            >
                <div
                    className={twMerge(
                        "flex flex-col space-y-2 w-full",
                        "border p-2 rounded",
                    )}
                >
                    <H2>RSE Protocols</H2>
                    <PageRSEProtocols comdom={props.protocolscomdom} />
                </div>
                <div
                    className={twMerge(
                        "flex flex-col space-y-2 w-full",
                        "border p-2 rounded",
                    )}
                >
                    <H2>RSE Attributes</H2>
                    <PageRSEAttributes comdom={props.attributescomdom} />
                </div>
            </div>
        </div>
    );
};
