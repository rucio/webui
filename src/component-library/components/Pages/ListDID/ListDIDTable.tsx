import { twMerge } from "tailwind-merge";
import { DID } from "@/lib/core/entity/rucio";
import { createColumnHelper } from "@tanstack/react-table";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { P } from "../../Text/Content/P";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { useCallback } from "react";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";

export const ListDIDTable = (
    props: {
        comdom: UseComDOM<DID>,
        selectionFunc: (data: DID[]) => void
    }
) => {
    const tableData = props.comdom
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
    const handleChange = useCallback((data: any[]) => {
        props.selectionFunc(data)
    }, [props])

    return (
        <StreamedTable
            tablecomdom={tableData}
            tablecolumns={tablecolumns}
            tablestyling={{
                tableFooterStack: true,
            }}
            tableselecting={{
                handleChange: handleChange,
                enableRowSelection: true,
                enableMultiRowSelection: false,
            }}
        />
    );
};
