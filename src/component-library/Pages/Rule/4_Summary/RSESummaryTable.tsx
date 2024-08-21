import { NormalTable } from '@/component-library/StreamedTables/NormalTable';
import { TableSortUpDown } from '@/component-library/StreamedTables/TableSortUpDown';
import { BasicStatusTag, BasicStatusTagProps } from '@/component-library/Tags/BasicStatusTag';
import { P } from '@/component-library/Text/Content/P';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { createColumnHelper } from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';
import { FileSize } from '@/component-library/Text/Content/FileSize';

type TRSESummaryTableRow = {
    rseName: string;
    remainingBytes: number;
    quota: number;
    hasQuota: boolean;
    tags: BasicStatusTagProps[];
};

export const RSESummaryTable = (props: { rseAccountUsageLimitViewModels: RSEAccountUsageLimitViewModel[] }) => {
    const generateTableData = () => {
        return props.rseAccountUsageLimitViewModels.map((rseAccountUsageLimitViewModel: RSEAccountUsageLimitViewModel) => {
            const badges: BasicStatusTagProps[] = [];
            if (!rseAccountUsageLimitViewModel.has_quota) {
                badges.push({
                    text: 'No Quota',
                    status: 'error',
                });
            }
            return {
                rseName: rseAccountUsageLimitViewModel.rse,
                hasQuota: rseAccountUsageLimitViewModel.has_quota,
                remainingBytes: rseAccountUsageLimitViewModel.bytes_remaining,
                quota: rseAccountUsageLimitViewModel.bytes_limit,
                tags: badges,
            } as TRSESummaryTableRow;
        });
    };
    const generateMessages = () => {
        const messages: string[] = [];
        const multiRSE: boolean = props.rseAccountUsageLimitViewModels.length > 1;
        if (multiRSE) {
            messages.push('The rule will replicate on one of the following RSEs.');
        } else {
            messages.push('The rule will replicate on the following RSE.');
        }
        return messages;
    };

    const tableData = generateTableData();
    const messages = generateMessages();
    const columnHelper = createColumnHelper<TRSESummaryTableRow>();
    const tablecolumns: any[] = [
        columnHelper.accessor('rseName', {
            id: 'rseName',
            header: info => {
                return <div className={twMerge('text-xl text-left', 'text-text-0')}>RSE</div>;
            },
            cell: info => {
                return (
                    <div className={twMerge('text-left', 'dark:text-text-0 text-text-1000')}>
                        <P>{info.getValue()}</P>
                    </div>
                );
            },
            meta: {
                style: 'w-64',
            },
        }),
        columnHelper.accessor('remainingBytes', {
            id: 'remainingBytes',
            header: info => {
                return <TableSortUpDown name="Remaining" column={info.column} className="px-2 text-cente text-text-0" />;
            },
            cell: info => {
                const value = info.getValue();
                return (
                    <div className={twMerge('flex flex-col items-left', 'text-left dark:text-text-0 text-text-1000')}>
                        <FileSize bytesNumber={value} />
                    </div>
                );
            },
            meta: {
                style: 'w-48',
            },
        }),
        columnHelper.accessor('quota', {
            id: 'quota',
            header: info => {
                return <TableSortUpDown name="Quota" column={info.column} className="px-2 text-text-0" />;
            },
            cell: info => {
                const value = info.getValue();
                return (
                    <div className={twMerge('flex flex-col items-left', 'text-left', 'dark:text-text-0 text-text-1000')}>
                        <FileSize bytesNumber={value} />
                    </div>
                );
            },
            meta: {
                style: 'w-48',
            },
        }),
        columnHelper.accessor('tags', {
            id: 'tags',
            header: info => {
                return <span className="text-xl text-text-0">Tags</span>;
            },
            cell: info => {
                return (
                    <div className="flex flex-col items-center">
                        {info.getValue().map((tagProps, idx) => {
                            return <BasicStatusTag key={idx} {...tagProps} />;
                        })}
                    </div>
                );
            },
            meta: {
                style: 'w-48',
            },
        }),
    ];
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-start space-x-2">
                <h1 className={twMerge('text-2xl font-bold dark:text-text-0 text-text-1000')}>RSE Overview</h1>
            </div>
            <div
                className={twMerge('px-2 mx-2 rounded border dark:border-0', 'bg-neutral-200 dark:bg-neutral-800', 'dark:text-text-0 text-text-1000')}
            >
                <ul className="">
                    {messages.map((message, index) => {
                        return (
                            <li key={index} className="pl-5 list-disc">
                                {message}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <NormalTable<TRSESummaryTableRow>
                tablecolumns={tablecolumns}
                tabledata={tableData}
                tablestyling={{
                    tableHeadRowStyle: 'border-b border-gray-300 bg-gray-700 dark:bg-gray-800',
                    tableBodyRowStyle: twMerge(
                        'bg-neutral-0 odd:bg-neutral-100 text-text-1000',
                        'dark:bg-neutral-700 odd:dark:bg-neutral-800 dark:text-text-100',
                        'border-b border-neutral-300',
                    ),
                }}
            />
        </div>
    );
};
