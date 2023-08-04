// components
import { P } from "../../Text/Content/P";
import { PageDIDFilereplicas } from "./PageDIDFilereplicas";

// misc packages, react
import { createColumnHelper } from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"

// Viewmodels etc
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { FilereplicaStateDViewModel, FilereplicaStateViewModel } from "@/lib/infrastructure/data/view-model/did";



export const PageDIDFilereplicasD = (
    props: {
        datasetComDOM: UseComDOM<FilereplicaStateDViewModel>,
        replicaComDOM: UseComDOM<FilereplicaStateViewModel>,
        onChangeDatasetSelection: (selected: string) => void,
    }
) => {
    const { datasetComDOM, replicaComDOM, onChangeDatasetSelection } = props
    const columnHelper = createColumnHelper<FilereplicaStateDViewModel>()
    const tablecolumns: any[] = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="File"
                    />
                )
            },
            cell: info => {
                return (
                    <P>{info.getValue()}</P>
                )
            }
        }),
    ]

    return (
        <div className="pt-1">
            <i>Select a file and view the states of its replicas.</i>
            <div
                className={twMerge(
                    "xl:grid xl:grid-cols-2 xl:gap-4 xl:pt-1",
                )}
            >
                <StreamedTable
                    tablecomdom={datasetComDOM}
                    tablecolumns={tablecolumns}
                    tablestyling={{}}
                    tableselecting={{
                        handleChange: (data: FilereplicaStateDViewModel[]) => { console.info(data) },
                        enableRowSelection: true,
                        enableMultiRowSelection: false
                    }}
                />
                <PageDIDFilereplicas comdom={replicaComDOM} />
            </div>
        </div>
    )
}