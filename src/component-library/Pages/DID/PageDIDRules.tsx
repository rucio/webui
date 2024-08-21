// components
import { H3 } from '../../Text/Headings/H3';
import { HiDotsHorizontal } from 'react-icons/hi';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { RuleStateTag } from '../../Tags/RuleStateTag';
import { DateTag } from '../../Tags/DateTag';
import { RuleState } from '@/lib/core/entity/rucio';
import { StreamedTable } from '../../StreamedTables/StreamedTable';
import { TableFilterDiscrete } from '../../StreamedTables/TableFilterDiscrete';
import { TableFilterString } from '../../StreamedTables/TableFilterString';
import { TableSortUpDown } from '../../StreamedTables/TableSortUpDown.stories';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { DIDRulesViewModel } from '@/lib/infrastructure/data/view-model/did';

export const PageDIDRules = (props: { comdom: UseComDOM<DIDRulesViewModel> }) => {
    const columnHelper = createColumnHelper<DIDRulesViewModel>();
    const tablecolumns: any[] = [
        columnHelper.accessor('id', {
            id: 'id',
        }),
        columnHelper.accessor('name', {
            id: 'Rule',
            cell: info => {
                return (
                    <span className={twMerge('flex flex-row space-x-2')}>
                        <span className={twMerge('break-all pl-1 dark:text-text-0 text-text-1000')}>{info.getValue()}</span>
                        <RuleStateTag state={info.row.original.state} tiny className={windowSize[0] > 1024 ? 'hidden' : ''} />
                    </span>
                );
            },
            header: info => {
                return <TableFilterString column={info.column} name="Rule" />;
            },
            meta: {
                style: 'pl-1',
            },
        }),
        columnHelper.accessor('state', {
            id: 'state',
            cell: info => {
                return <RuleStateTag state={info.getValue()} />;
            },
            header: info => {
                return (
                    <TableFilterDiscrete<RuleState>
                        name="Rule State"
                        keys={Object.values(RuleState)}
                        renderFunc={key =>
                            key === undefined ? (
                                <HiDotsHorizontal className="text-2xl text-text-500 dark:text-text-200" />
                            ) : (
                                <RuleStateTag state={key} tiny />
                            )
                        }
                        column={info.column}
                    />
                );
            },
            meta: {
                style: 'w-28 md:w-44 cursor-pointer select-none',
            },
        }),
        columnHelper.accessor('account', {
            id: 'Account',
            cell: info => {
                return <p className={twMerge('break-all pl-1 dark:text-text-0 text-text-1000')}>{info.getValue()}</p>;
            },
            header: info => {
                return <TableFilterString column={info.column} name="Account" />;
            },
            meta: {
                style: 'pl-1',
            },
        }),
        columnHelper.accessor('subscription', {
            id: 'subscription',
            cell: info => {
                return <p className={twMerge('break-all pl-1 dark:text-text-0 text-text-1000')}>{info.getValue()?.name ?? ''}</p>;
            },
            header: info => {
                return <H3 className="text-left">Subscription</H3>;
            },
            meta: {
                style: '',
            },
        }),
        columnHelper.accessor('last_modified', {
            id: 'last_modified',
            cell: info => {
                return <DateTag date={new Date(info.getValue())} className="pl-1" />;
            },
            header: info => {
                return <TableSortUpDown name="Last Modified" column={info.column} />;
            },
            meta: {
                style: 'w-48',
            },
        }),
    ];

    // handle window resize
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

    return (
        <StreamedTable<DIDRulesViewModel>
            tablecomdom={props.comdom}
            tablecolumns={tablecolumns}
            tablestyling={{
                visibility: {
                    id: false,
                    Rule: true,
                    state: windowSize[0] > 1024,
                    Account: true,
                    subscription: windowSize[0] > 1024,
                    last_modified: windowSize[0] > 640,
                },
            }}
        />
    );
};
