import { twMerge } from "tailwind-merge";
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { DID } from "@/lib/core/entity/rucio";
import { createColumnHelper } from "@tanstack/react-table";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { P } from "../../Text/Content/P";
import { StreamedTable } from "../../StreamedTables/StreamedTable";

export const ListDIDTable = (
    props: {
        tableData: TableData<DID>,
        selectkey?: string
    }
) => {
    const tableData = props.tableData
    const columnHelper = createColumnHelper<DID>()
    const tablecolumns = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="DID"
                    />
                )
            },
            cell: info => <P className="break-all">{info.getValue()}</P>
        })
    ]
    return (
        <StreamedTable
            tabledata={tableData}
            tablecolumns={tablecolumns}
            tablestyling={{}}
            tableselecting={{
                onSelect: (key: string) => {},
                enableRowSelection: true,
                enableMultiRowSelection: true,
            }}
        />
    );
};
