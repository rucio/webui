// components
import { H3 } from "../../Text/Headings/H3";
import { BoolTag } from "../../Tags/BoolTag";
import { AvailabilityTag } from "../../Tags/AvailabilityTag";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { DIDType } from "@/lib/core/entity/rucio";
import { DateTag } from "../../Tags/DateTag";
import { NullTag } from "../../Tags/NullTag";
import { StreamedTable } from "../../StreamedTables/StreamedTable";

// misc packages, react
import { createColumnHelper } from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"

// Viewmodels etc
import { DIDAvailability } from "@/lib/core/entity/rucio"
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { DIDKeyValuePairsDataViewModel } from "@/lib/infrastructure/data/view-model/did";

export const PageDIDMetadata = (
    props: {
        comdom: UseComDOM<DIDKeyValuePairsDataViewModel> // remember that this is ONLY the custom metadata
    }
) => {

    const columnHelper = createColumnHelper<DIDKeyValuePairsDataViewModel>()
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
                if (["Available", "Deleted", "Lost"].includes(val as string)) {
                    return <AvailabilityTag availability={val as DIDAvailability} />
                }
                if (Object.values(DIDType).includes(val as DIDType)) {
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

    return (
        <StreamedTable<DIDKeyValuePairsDataViewModel>
            tablecomdom={props.comdom}
            tablecolumns={tablecolumns}
            tablestyling={{}}
        />
    )
}