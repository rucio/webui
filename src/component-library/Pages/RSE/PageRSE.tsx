import { DateISO, RSE, RSEBlockState } from "@/lib/core/entity/rucio";
import { H1 } from "../../Text/Headings/H1";
import { twMerge } from "tailwind-merge";
import { Generaltable } from "../../Helpers/Metatable";
import { Titleth, Contenttd } from "../../Helpers/Metatable";
import { BoolTag } from "../../Tags/BoolTag";
import { RSETypeTag } from "../../Tags/RSETypeTag";
import { RSETag } from "../../Tags/RSETag";
import { HiArrowCircleLeft } from "react-icons/hi";
import { RSEAttribute, RSEAttributeViewModel, RSEProtocol, RSEProtocolViewModel, RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { PageRSEProtocols } from "./PageRSEProtocols";
import { PageRSEAttributes } from "./PageRSEAttributes";
import { H2 } from "../../Text/Headings/H2";
import { Body } from "../Helpers/Body";
import { Heading } from "../Helpers/Heading";

type PageRSEProps = {
    rse: RSEViewModel
    rseblockstate: RSEBlockState
    protocolscomdom: UseComDOM<RSEProtocolViewModel>
    attributescomdom: UseComDOM<RSEAttributeViewModel>
    fromrselist?: boolean
}

export const PageRSE = (
    props: PageRSEProps
) => {
    return (
        <div
            className={twMerge("flex flex-col space-y-2 w-full")}
        >
            <Heading
                title="View RSE"
                subtitle={`For RSE ${props.rse.name}`}
            >
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
            </Heading>
            <Body>
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
            </Body>
        </div>
    );
};
