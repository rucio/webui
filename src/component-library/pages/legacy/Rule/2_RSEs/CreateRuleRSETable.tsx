import { twMerge } from 'tailwind-merge';
import { StreamedTable } from '@/component-library/features/legacy/StreamedTables/StreamedTable';
import { createColumnHelper, Row } from '@tanstack/react-table';
import { H3 } from '../../../../atoms/legacy/text/headings/H3/H3';
import { P } from '../../../../atoms/legacy/text/content/P/P';
import { FileSize } from '../../../../atoms/legacy/text/content/FileSize/FileSize';
import { TableSortUpDown } from '@/component-library/features/legacy/StreamedTables/TableSortUpDown';
import { useState, useEffect } from 'react';
import { TableFilterString } from '@/component-library/features/legacy/StreamedTables/TableFilterString';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';

export const CreateRuleRSETable = (props: {
    comdom: UseComDOM<RSEAccountUsageLimitViewModel>;
    handleChange: (data: RSEAccountUsageLimitViewModel[]) => void;
    askApproval?: boolean;
}) => {
    const columnHelper = createColumnHelper<RSEAccountUsageLimitViewModel>();
    const isNoQuotaLeftFunction = (row: Row<RSEAccountUsageLimitViewModel>) => {
        let noQuota = !row.original.has_quota;
        return props.askApproval ? false : noQuota;
    };
    const tablecolumns = [
        columnHelper.display({
            id: 'selection',
            header: info => <span className="w-8" />,
            cell: info => {
                return (
                    <span className="ml-1 w-6 sm:ml-2 sm:w-8">
                        <input
                            type="checkbox"
                            disabled={!info.row.getCanSelect()}
                            checked={info.row.getIsSelected()}
                            onChange={e => {
                                info.row.toggleSelected();
                            }}
                        />
                    </span>
                );
            },
            meta: {
                style: 'w-6 sm:w-8',
            },
        }),
        columnHelper.accessor('rse_id', {
            id: 'rse_id',
            header: info => <H3 className="text-left text-text-2 dark:text-text-0">RSE ID</H3>,
            cell: info => <P mono>{info.getValue()}</P>,
        }),
        columnHelper.accessor('rse', {
            id: 'rse',
            header: info => {
                return <TableFilterString column={info.column} name="RSE Name" />;
            },
            cell: info => (
                <P mono className="break-all text-text-1000 dark:text-text-0">
                    {info.getValue()}
                </P>
            ),
        }),
        columnHelper.accessor('used_bytes', {
            id: 'used_bytes',
            header: info => {
                return <TableSortUpDown name="Used" column={info.column} className="pl-2" stack />;
            },
            cell: info => {
                // if value is greater than quota bytes, print in red
                return (
                    <P
                        mono
                        className={twMerge(
                            isNoQuotaLeftFunction(info.row)
                                ? 'text-base-error-500 dark:text-base-error-500 font-bold'
                                : 'text-text-1000 dark:text-text-0',
                            'text-right',
                        )}
                    >
                        <FileSize bytesNumber={info.getValue()} />
                    </P>
                );
            },
            meta: {
                style: 'w-24',
            },
        }),
        columnHelper.accessor(row => row.bytes_remaining, {
            id: 'remaining_bytes',
            header: info => {
                return <TableSortUpDown name="Remaining" column={info.column} className="pl-2" stack nocollapse />;
            },
            cell: info => {
                // if value is greater than quota bytes, print in red
                return (
                    <P
                        mono
                        className={twMerge(
                            isNoQuotaLeftFunction(info.row)
                                ? 'text-base-error-500 dark:text-base-error-500 font-bold'
                                : 'text-text-1000 dark:text-text-0',
                            'text-right',
                        )}
                    >
                        <FileSize bytesNumber={info.getValue()} />
                    </P>
                );
            },
            meta: {
                style: 'w-24',
            },
        }),
        columnHelper.accessor('bytes_limit', {
            id: 'bytes_limit',
            header: info => {
                return <TableSortUpDown name="Quota" column={info.column} className="pl-2" stack />;
            },
            cell: props => {
                return (
                    <P mono className="text-right text-text-1000 dark:text-text-0">
                        <FileSize bytesNumber={props.row.original.bytes_limit} />
                    </P>
                );
            },
            meta: {
                style: 'w-24',
            },
        }),
    ];

    const [windowSize, setWindowSize] = useState([1920, 1080]);

    useEffect(() => {
        setWindowSize([window.innerWidth, window.innerHeight]);

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    const isMd = () => windowSize[0] > 768; // 768px is the breakpoint for md => is minimum md sized

    return (
        <StreamedTable
            tablecomdom={props.comdom}
            tablecolumns={tablecolumns}
            tableselecting={{
                handleChange: props.handleChange,
                enableRowSelection: true,
                enableMultiRowSelection: true,
            }}
            tablestyling={{
                visibility: {
                    rse_id: false,
                    used_bytes: isMd(),
                    bytes_limit: isMd(),
                },
            }}
        />
    );
};
