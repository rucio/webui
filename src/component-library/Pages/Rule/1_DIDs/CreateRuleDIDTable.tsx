import { DIDType } from "@/lib/core/entity/rucio";
import { createColumnHelper } from "@tanstack/react-table";
import { DIDTypeTag } from "../../../Tags/DIDTypeTag";
import { Number } from "../../../Text/Content/Number";
import { P } from "../../../Text/Content/P";
import { StreamedTable } from "../../../StreamedTables/StreamedTable";
import { TableFilterString } from "../../../StreamedTables/TableFilterString";
import { TableFilterDiscrete } from "../../../StreamedTables/TableFilterDiscrete";
import { HiDotsHorizontal } from "react-icons/hi";
import { TableSortUpDown } from "../../../StreamedTables/TableSortUpDown";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { DIDLongViewModel } from "@/lib/infrastructure/data/view-model/did";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";

export const CreateRuleDIDTable = (
    props: {
        comdom: UseComDOM<ListDIDsViewModel>,
        handleChange: (data: ListDIDsViewModel[]) => void,
    }
) => {
    const columnHelper = createColumnHelper<DIDLongViewModel>()
    const tablecolumns: any[] = [
        columnHelper.display({
            id: "selection",
            header: info => <span className="w-8"/>,
            cell: info => {
                return (
                    <span className="ml-1 w-6 sm:ml-2 sm:w-8">
                        <input
                            type="checkbox"
                            disabled={!info.row.getCanSelect()}
                            checked={info.row.getIsSelected()}
                            onChange={e => {
                                info.row.toggleSelected()
                            }}
                        />
                    </span>
                )
            },
            meta: {
                style: "w-6 sm:w-8"
            }
        }),
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
            cell: info => <P className="break-all pr-1">{info.getValue()}</P>
        }),
        columnHelper.accessor('did_type', {
            id: 'did_type',
            header: info => {
                return (
                    <TableFilterDiscrete<DIDType>
                        name="DID Type"
                        keys={[DIDType.CONTAINER, DIDType.DATASET, DIDType.FILE]}
                        renderFunc={state => state === undefined ? <HiDotsHorizontal className="text-xl text-text-500 dark:text-text-200" /> : <DIDTypeTag didtype={state} forcesmall />}
                        column={info.column}
                    />
                )
            },
            cell: (info) => <DIDTypeTag didtype={info.row.original.did_type} />,
            meta: {
                style: "w-6 sm:w-8 md:w-36"
            }
        }),
        columnHelper.accessor('bytes', {
            id: 'bytes',
            header: info => {
                return (
                    <TableSortUpDown
                        name="Bytes"
                        column={info.column}
                    />
                )
            },
            cell: (info) =>
                <p className="font-mono dark:text-text-200 text-text-800">
                    <Number number={info.getValue()} />
                </p>,
            meta: {
                style: "w-36"
            }
        }),
    ]
    return (
        <StreamedTable
            tablecomdom={props.comdom}
            tablecolumns={tablecolumns}
            tableselecting={{
                handleChange: props.handleChange,
                enableRowSelection: true,
                enableMultiRowSelection: true
            }}
        />
    )
};
