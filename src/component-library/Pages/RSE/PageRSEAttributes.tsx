import { twMerge } from "tailwind-merge";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { createColumnHelper } from "@tanstack/react-table";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { P } from "../../Text/Content/P";
import { H3 } from "../../Text/Headings/H3";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { BoolTag } from "../../Tags/BoolTag";
import { NullTag } from "../../Tags/NullTag";
import { RSEAttributeViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { RSEAttribute } from "@/lib/core/entity/rucio";

export const PageRSEAttributes = (
    props: {
        // TODO: @ThePhisch data will not be streamed, but loaded in one go
        comdom: UseComDOM<RSEAttributeViewModel>
    }
) => {
    const columnHelper = createColumnHelper<RSEAttribute>()
    const tablecolumns: any[] = [
        columnHelper.accessor("key", {
            id: "key",
            header: info => <TableFilterString column={info.column} name="RSE Attribute" />,
            cell: info => <P>{info.getValue()}</P>
        }),
        columnHelper.accessor("value", {
            id: "value",
            header: info => <H3>Value</H3>,
            cell: info => {
                const val = info.getValue()
                if (typeof (val) === "boolean") {
                    return <BoolTag val={val} />
                } else if (val === null) {
                    return <NullTag />
                } else {
                    return <P>{val}</P>
                }
            }
        }),
    ]
    return (
        <StreamedTable<RSEAttributeViewModel>
            tablecomdom={props.comdom}
            tablecolumns={tablecolumns}
            tablestyling={{}}
        />
    );
};
