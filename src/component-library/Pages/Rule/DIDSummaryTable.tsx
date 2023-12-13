import { NormalTable } from "@/component-library/StreamedTables/NormalTable"
import { createColumnHelper } from "@tanstack/react-table"
import { BasicStatusTag, BasicStatusTagProps } from "@/component-library/Tags/BasicStatusTag"
import { P } from "@/component-library/Text/Content/P"
import { TableSortUpDown } from "@/component-library/StreamedTables/TableSortUpDown"
import { Number } from "@/component-library/Text/Content/Number"
import { twMerge } from "tailwind-merge"
import { generateDerivedDIDName, generateNewScope } from "@/lib/core/utils/did-utils"
import { AccountInfo, DID } from "@/lib/core/entity/rucio"
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did"
import { SamplingTag } from "@/component-library/Tags/SamplingTag"


export type TDIDSummaryTableRowProps = {
    name: string
    copies: number
    files: number
    size: number | '-'
    requestedSize: number | '-'
    tags: BasicStatusTagProps[]
}
export const DIDSummaryTable = (props: {
    numSamples: number,
    takeSamples: boolean,
    userAskedForApproval: boolean,
    listDIDViewModels: ListDIDsViewModel[],
    numcopies: number,
    accountInfo: AccountInfo,
}) => {
    const generateDIDSummaryTableData = (): TDIDSummaryTableRowProps[] => {
        if (!props.takeSamples) {
            return props.listDIDViewModels.map((did: ListDIDsViewModel, index) => {
                const showOpenBadge = did.open
                const badges: BasicStatusTagProps[] = []
                if (showOpenBadge) {
                    badges.push({
                        text: 'Open',
                        status: 'warning',
                    })
                }
                return {
                    name: `${did.scope}:${did.name}`,
                    copies: props.numcopies,
                    size: did.bytes,
                    files: did.length,
                    requestedSize: props.numcopies * did.bytes,
                    tags: badges,
                } as TDIDSummaryTableRowProps
            })
        }
        const accountType = props.accountInfo.accountType
        const account = props.accountInfo.account
        const newScope = generateNewScope(account, accountType)
        const tableData: TDIDSummaryTableRowProps[] = []
        props.listDIDViewModels.forEach((did: ListDIDsViewModel, index) => {
            const derivedDID: DID = generateDerivedDIDName(newScope, did)
            tableData.push({
                name: `${derivedDID.scope}:${derivedDID.name}`,
                copies: props.numcopies,
                files: props.numSamples,
                size: '-',
                requestedSize: `-`,
                tags: [
                    {
                        text: 'Derived',
                        status: 'info',
                    }
                ]
            })
        })
        return tableData
    }
    const generateMessages = () => {
        const messages: string[] = []
        const multiDID = props.listDIDViewModels.length > 1
        const openDIDs = props.listDIDViewModels.filter((did) => did.open)
        if (props.takeSamples) {
            if (props.userAskedForApproval) {
                messages.push(`You have asked for approval to create a rule for the following sample dataset(s) with ${props.numSamples} file(s).`)
            } else {
                messages.push(`This will create a rule for following sample dataset(s) with ${props.numSamples} file(s).`)
            }
        } else {
            messages.push("This  will create a rule for" + (multiDID ? ' the DIDs listed below' : ' the DID shown below.'));
            if (openDIDs.length > 0) {
                messages.push("There are open DIDs present in your request. Everything that will be added to them after you created the rule will also be transferred to the selected RSE.")
            }
        }
        if (props.userAskedForApproval) {
            if (multiDID) {
                messages.push("You have asked for approval for Multiple DIDs. This request will create a new container and will put all of the following DIDs into it. The rule will be created on the new container.")
            } else {
                messages.push("You have asked for approval to create this rule.")
            }
        }

        return messages
    }

    const tabledata = generateDIDSummaryTableData()
    const messages = generateMessages()

    const totalFiles: number = tabledata.reduce((sum, row) => {
        if (typeof row.files !== 'number') {
            return parseInt(row.files) + sum // For some reason, the type of row.files is string | number
        }
        return sum + row.files;
    }, 0);

    const totalSize: number | '-' = props.takeSamples ? '-' : tabledata.reduce((sum, row) => {
        return typeof row.size === 'number' ? sum + row.size : sum;
    }, 0);
    const totalRequestedSize: number | '-' = props.takeSamples ? '-' : tabledata.reduce((sum, row) => {
        return typeof row.requestedSize === 'number' ? sum + row.requestedSize : sum;
    }, 0);

    const columnHelper = createColumnHelper<TDIDSummaryTableRowProps>()
    const tablecolumns: any[] = [
        columnHelper.accessor("name", {
            id: "did",
            header: info => {
                return (
                    <div className="text-xl text-left dark:text-white">
                        <span>DID</span>
                    </div>
                )
            },
            cell: info => (
                <div className="flex flex-col items-left px-2">
                    <P className="break-all pr-1">{info.getValue()}</P>
                </div>
            ),
            meta: {
                style: "min-w-100"
            }
        }),
        columnHelper.accessor("copies", {
            id: "copies",
            header: info => {
                return (
                    <div className="text-left text-xl dark:text-white">
                        <span>Copies</span>
                    </div>
                )
            },
            cell: info => (
                <div className="flex flex-col items-center w-36 px-2">
                    <span className="text-left w-36 dark:text-white">{info.getValue()}</span>
                </div>
            ),
            meta: {
                style: "w-36"
            }
        }),
        columnHelper.accessor("files", {
            id: "files",
            header: info => {
                return (
                    <TableSortUpDown
                        name="Files"
                        column={info.column}
                        className="px-2"
                    />
                )
            },
            cell: (info) => (
                <div className={twMerge(
                    "flex flex-col items-left",
                    "text-left dark:text-white",
                    "w-24 px-2"
                )}
                >
                    <span>{info.getValue()}</span>
                </div>
            ),
            meta: {
                style: "w-24"
            }
        }),
        columnHelper.accessor("size", {
            id: "size",
            header: info => {
                return (
                    <TableSortUpDown
                        name="Size"
                        column={info.column}
                        className="px-2"
                    />
                )
            },
            cell: info => {
                const value = info.getValue()
                if (value === '-') {
                    return (
                        <div className="flex flex-col items-justify text-center dark:text-white px-2">
                            <span className="">-</span>
                        </div>
                    )
                }
                return (
                    <div className={twMerge("flex flex-col items-left",
                        "text-right dark:text-white"
                    )}>
                        <Number number={value} />
                    </div>
                )
            },
            meta: {
                style: "w-24"
            }
        }),
        columnHelper.accessor("requestedSize", {
            id: "requestedSize",
            header: info => {
                return (
                    <div className="flex flex-row items-justify">
                        <TableSortUpDown
                            name="Requested Size"
                            column={info.column}
                            className="px-2"
                        />
                    </div>
                )
            },
            cell: info => {
                const value = info.getValue()
                if (value === '-') {
                    return (
                        <div className="flex flex-col items-justify text-center dark:text-white px-2">
                            <span className="">-</span>
                        </div>
                    )
                }
                return (
                    <div className={twMerge("flex flex-col items-left",
                        "text-right dark:text-white"
                    )}>
                        <Number number={value} />
                    </div>
                )
            },
            meta: {
                style: "w-64"
            }
        }),
        columnHelper.accessor("tags", {
            id: "tags",
            header: info => {
                return (
                    <span className="text-xl dark:text-white">Tags</span>
                )
            },
            cell: (info) => {
                return <div className="flex flex-col items-center">
                    {info.getValue().map((tagProps, idx) => {
                        return <BasicStatusTag key={idx} {...tagProps} />
                    })}
                </div>
            }
        }),
    ]

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-start space-x-2">
                <h1
                    className={twMerge("text-2xl font-bold text-black dark:text-white")}
                >
                    DID Overview
                </h1>
                <SamplingTag sampling={props.takeSamples} />
            </div>
            <div>
                <div
                    className={twMerge(
                        "px-2 mx-2 rounded border dark:border-0",
                        "bg-gray-200 dark:bg-gray-800",
                        "dark:text-white"
                    )}
                >
                    <ul className="">
                        {messages.map((message, index) => {
                            return (
                                <li
                                    key={index}
                                    className="pl-5 list-disc"
                                >
                                    {message}
                                </li>
                            )
                        })
                        }
                    </ul>
                </div>
            </div>
            <NormalTable<TDIDSummaryTableRowProps>
                className="w-full rounded-md"
                tabledata={tabledata}
                tablecolumns={tablecolumns}
                tablestyling={{
                    "tableHeadRowStyle": "border-b border-gray-300 bg-gray-700 dark:bg-gray-800",
                    "tableBodyRowStyle": twMerge(
                        "bg-white odd:bg-stone-100 text-black",
                        "dark:bg-gray-700 odd:dark:bg-gray-800 dark:text-gray-100",
                        "border-b border-gray-300",
                    )
                }}
            />
            <div
                className=""
            >
                <table className={twMerge(
                    "w-full rounded-md table-fixed relative",
                    "bg-white dark:bg-gray-700",
                    "text-gray-800 dark:text-gray-100"
                )}
                >
                    <tbody>
                        <tr className="text-black dark:text-white">
                            <th className="w-56 pl-2 py-2 text-left">Parameter</th>
                            <th className="pl-2 py-2 text-left">Value</th>
                        </tr>
                        <tr className="border-t dark:border-gray-400">
                            <td className="w-56 pl-2 py-1">Total Files</td>
                            <td className="pl-2 py-1">{totalFiles}</td>
                        </tr>
                        <tr className="border-t dark:border-gray-400">
                            <td className="w-56 pl-2 py-1">Total Size</td>
                            <td className="pl-2 py-1">{
                                typeof totalSize === 'number' ? <Number number={totalSize} /> : totalSize
                            }</td>
                        </tr>
                        <tr className="border-t dark:border-gray-400">
                            <td className="w-56 pl-2 py-1">Total Requested Size</td>
                            <td className="pl-2 py-1">
                                {
                                    typeof totalRequestedSize === 'number' ? <Number number={totalRequestedSize} /> : totalRequestedSize
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}