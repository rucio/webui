import useReponsiveHook from "@/component-library/Helpers/ResponsiveHook"
import { TableFilterDiscrete } from "@/component-library/StreamedTables/TableFilterDiscrete"
import { RequestTypeTag } from "@/component-library/Tags/RequestTypeTag"
import { RequestType } from "@/lib/core/entity/rucio"
import { TransferViewModel } from "@/lib/infrastructure/data/view-model/request"
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM"
import { createColumnHelper } from "@tanstack/react-table"
import { HiDotsHorizontal } from "react-icons/hi"
import { twMerge } from "tailwind-merge"
import { Heading } from "../Helpers/Heading"
import { StreamedTable } from "@/component-library/StreamedTables/StreamedTable"
import { Body } from "../Helpers/Body"

export const ListTransfer = (
    props: {
        comdom: UseComDOM<TransferViewModel>
    }
) => {
    const columnHelper = createColumnHelper<TransferViewModel>()
    const tablecolumns = [
        columnHelper.accessor("scope", {}),
        columnHelper.accessor("name", {}),
        columnHelper.accessor("request_type", {
            id: "request_type",
            header: info => {
                return (
                    <TableFilterDiscrete<RequestType>
                        name="Request Type"
                        keys={Object.values(RequestType)} 
                        renderFunc={key => key === undefined ? <HiDotsHorizontal className="text-2xl text-gray-500 dark:text-gray-200" /> : <RequestTypeTag requesttype={key} forcesmall />}
                        column={info.column}
                        stack
                    />
                )
            },
            cell: info => <RequestTypeTag requesttype={info.getValue()} />,
            meta: {
                style: "w-8 md:w-32"
            }
        }),
        columnHelper.accessor("requested_at", {
        }),
        columnHelper.accessor("bytes", {
        }),
        columnHelper.accessor("priority", {
        }),
        columnHelper.accessor("transfertool", {
        })
    ]

    const responsive = useReponsiveHook()

    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full"
            )}
        >
            <Heading
                title="List Active Transfers"
                subtitle={`For Pair (RSE)`}
            />
            <Body>
                <StreamedTable<TransferViewModel>
                    tablecomdom={props.comdom}
                    tablecolumns={tablecolumns}
                    tablestyling={{
                        tableHeadRowStyle: "md:h-16",
                        visibility: {
                        }
                    }}
                />
            </Body>
        </div>
    )
}