// components
import { H3 } from "../../Text/Headings/H3";
import { BoolTag } from "../../Tags/BoolTag";
import { AvailabilityTag } from "../../Tags/AvailabilityTag";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { DIDType } from "@/lib/core/entity/rucio";
import { NullTag } from "../../Tags/NullTag";

// misc packages, react
import { createColumnHelper } from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"

// Viewmodels etc
import { DIDAvailability } from "@/lib/core/entity/rucio"
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { DIDKeyValuePairsDataViewModel } from "@/lib/infrastructure/data/view-model/did";
import { DIDKeyValuePair } from "@/lib/infrastructure/data/view-model/page-did";
import { NormalTable } from "@/component-library/StreamedTables/NormalTable";

export const PageDIDMetadata = (
    props: {
        tabledata: DIDKeyValuePairsDataViewModel // remember that this is ONLY the custom metadata
    }
) => {

    const columnHelper = createColumnHelper<DIDKeyValuePair>()
    const tablecolumns: any[] = [
        columnHelper.accessor("key", {
            id: "key",
            cell: (info) => {
                return (
                    <span className={twMerge("dark:text-white")}>
                        {info.getValue()}
                    </span>
                )
            },
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="Key"
                    />
                )
            }
        }
        ),
        columnHelper.accessor("value", {
            id: "value",
            cell: (info) => {
                const val = info.getValue()
                if (typeof (val) === "boolean") {
                    return <BoolTag val={val} />
                }
                if (val === null) {
                    return <NullTag />
                }
                if (Object.keys(DIDAvailability).includes(val as string)) {
                    return <AvailabilityTag availability={val as DIDAvailability} />
                }
                if (Object.keys(DIDType).includes(val as DIDType)) {
                    return <DIDTypeTag didtype={val as DIDType} />
                }
                else {
                    return <span className="dark:text-white">{val as string}</span>
                }
            },
            header: info => {
                return (
                    <H3 className="text-left">Value</H3>
                )
            }
        })
    ]

    if (props.tabledata.status === "pending") {
        return (
            <div
                aria-label="DID Metadata Quick Summary -- Loading"
                aria-busy="true"
            >
                Loading DID Metadata
            </div>
        )
    }
    return (
        <NormalTable<DIDKeyValuePair>
            tabledata={props.tabledata.data || []}
            tablecolumns={tablecolumns}
        />
    )
}