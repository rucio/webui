import { twMerge } from 'tailwind-merge';
import { H3 } from '../../../atoms/legacy/text/headings/H3/H3';
import { P } from '../../../atoms/legacy/text/content/P/P';
import { StreamedTable } from '@/component-library/features/legacy/StreamedTables/StreamedTable';
import { createColumnHelper } from '@tanstack/react-table';
import { TableFilterString } from '@/component-library/features/legacy/StreamedTables/TableFilterString';
import { TableSortUpDown } from '@/component-library/features/legacy/StreamedTables/TableSortUpDown';
import { RuleStateTag } from '@/component-library/features/legacy/Tags/RuleStateTag';
import { RuleState } from '@/lib/core/entity/rucio';
import React, { useState, useEffect } from 'react';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { Body } from '@/component-library/pages/legacy/Helpers/Body';
import { Heading } from '@/component-library/pages/legacy/Helpers/Heading';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { TableInternalLink } from '@/component-library/features/legacy/StreamedTables/TableInternalLink';
import useReponsiveHook from '@/component-library/hooks/legacy/ResponsiveHook';
import { InfoField } from '@/component-library/features/fields/InfoField';

export interface ListSubscriptionProps {
    accountname: string;
    comdom: UseComDOM<SubscriptionRuleStatesViewModel>;
}

export const ListSubscription = (props: ListSubscriptionProps) => {
    const columnHelper = createColumnHelper<SubscriptionRuleStatesViewModel>();
    const tablecolumns = [
        columnHelper.accessor('name', {
            id: 'name',
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="Name"
                        placeholder="Filter by Subscription Name"
                        className="ml-1 text-text-1000 dark:text-text-0"
                    />
                );
            },
            cell: info => (
                <TableInternalLink href={`/subscription/page/${props.accountname}/${info.row.original.name}`}>{info.getValue()}</TableInternalLink>
            ),
        }),
        columnHelper.accessor('state_ok', {
            id: 'state_ok',
            header: info => {
                return (
                    <TableSortUpDown
                        name="OK"
                        column={info.column}
                        element={<RuleStateTag className={responsive.lg ? 'md:w-28' : ''} tiny={!responsive.lg} state={RuleState.OK} />}
                        stack
                    />
                );
            },
            cell: info => (
                <P mono className="text-right pr-2 text-text-1000 dark:text-text-0">
                    {info.getValue()}
                </P>
            ),
            meta: {
                style: 'w-12 lg:w-32',
            },
        }),
        columnHelper.accessor('state_replicating', {
            id: 'state_replicating',
            header: info => {
                return (
                    <TableSortUpDown
                        name="Replicating"
                        column={info.column}
                        element={<RuleStateTag className={responsive.lg ? 'md:w-28' : ''} tiny={!responsive.lg} state={RuleState.REPLICATING} />}
                        stack
                    />
                );
            },
            cell: info => (
                <P mono className="text-right pr-2 text-text-1000 dark:text-text-0">
                    {info.getValue()}
                </P>
            ),
            meta: {
                style: 'w-12 lg:w-32',
            },
        }),
        columnHelper.accessor('state_stuck', {
            id: 'state_stuck',
            header: info => {
                return (
                    <TableSortUpDown
                        name="Stuck"
                        column={info.column}
                        element={<RuleStateTag className={responsive.lg ? 'md:w-28' : ''} tiny={!responsive.lg} state={RuleState.STUCK} />}
                        stack
                    />
                );
            },
            cell: info => (
                <P mono className="text-right pr-2 text-text-1000 dark:text-text-0">
                    {info.getValue()}
                </P>
            ),
            meta: {
                style: 'w-12 lg:w-32',
            },
        }),
        columnHelper.accessor('state_suspended', {
            id: 'state_suspended',
            header: info => {
                return (
                    <TableSortUpDown
                        name="Suspended"
                        column={info.column}
                        element={<RuleStateTag className={responsive.lg ? 'md:w-28' : ''} tiny={!responsive.lg} state={RuleState.SUSPENDED} />}
                        stack
                    />
                );
            },
            cell: info => (
                <P mono className="text-right pr-2 text-text-1000 dark:text-text-0">
                    {info.getValue()}
                </P>
            ),
            meta: {
                style: 'w-12 lg:w-32',
            },
        }),
        columnHelper.accessor('state_waiting_approval', {
            id: 'state_waiting_approval',
            header: info => {
                return (
                    <TableSortUpDown
                        name="Waiting Approval"
                        column={info.column}
                        element={<RuleStateTag className={responsive.lg ? 'md:w-28' : ''} tiny={!responsive.lg} state={RuleState.WAITING_APPROVAL} />}
                        stack
                    />
                );
            },
            cell: info => (
                <P mono className="text-right pr-2 text-text-1000 dark:text-text-0">
                    {info.getValue()}
                </P>
            ),
            meta: {
                style: 'w-12 lg:w-32',
            },
        }),
        columnHelper.accessor('state_inject', {
            id: 'state_inject',
            header: info => {
                return (
                    <TableSortUpDown
                        name="Inject"
                        column={info.column}
                        element={<RuleStateTag className={responsive.lg ? 'md:w-28' : ''} tiny={!responsive.lg} state={RuleState.INJECT} />}
                        stack
                    />
                );
            },
            cell: info => (
                <P mono className="text-right pr-2 text-text-1000 dark:text-text-0">
                    {info.getValue()}
                </P>
            ),
            meta: {
                style: 'w-12 lg:w-32',
            },
        }),
        columnHelper.display({
            id: 'condensed_states',
            header: info => <H3 className="text-left text-text-1000 dark:text-text-0">States</H3>,
            cell: info => {
                const MiniState = (props: { state: RuleState; amount: number }) => {
                    return (
                        <span className={twMerge('flex flex-row space-x-1 text-text-1000 dark:text-text-0')}>
                            <P mono className="text-right">
                                {props.amount}
                            </P>
                            <RuleStateTag tiny state={props.state} />
                        </span>
                    );
                };
                return (
                    <div className={twMerge('flex flex-col space-y-1 p-1', 'items-end')}>
                        <MiniState state={RuleState.OK} amount={info.row.original.state_ok} />
                        <MiniState state={RuleState.REPLICATING} amount={info.row.original.state_replicating} />
                        <MiniState state={RuleState.STUCK} amount={info.row.original.state_stuck} />
                        <MiniState state={RuleState.SUSPENDED} amount={info.row.original.state_suspended} />
                        <MiniState state={RuleState.WAITING_APPROVAL} amount={info.row.original.state_waiting_approval} />
                        <MiniState state={RuleState.INJECT} amount={info.row.original.state_inject} />
                    </div>
                );
            },
            meta: {
                style: 'w-24',
            },
        }),
    ];

    const responsive = useReponsiveHook();

    return (
        <div className={twMerge('flex flex-col space-y-2 w-full')}>
            <InfoField>
                <span>This page is currently in development. We are working on improvements, so stay tuned!</span>
            </InfoField>
            <Heading className="text-text-1000 dark:text-text-0" title="List Subscriptions" subtitle={`For account ${props.accountname}`} />
            <Body>
                <StreamedTable<SubscriptionRuleStatesViewModel>
                    tablecomdom={props.comdom}
                    tablecolumns={tablecolumns}
                    tablestyling={{
                        visibility: {
                            state_ok: responsive.sm,
                            state_replicating: responsive.sm,
                            state_stuck: responsive.sm,
                            state_suspended: responsive.sm,
                            state_waiting_approval: responsive.sm,
                            state_inject: responsive.sm,
                            condensed_states: !responsive.sm,
                        },
                        tableHeadRowStyle: 'md:h-16',
                        tableBodyRowStyle: 'h-8',
                    }}
                />
            </Body>
        </div>
    );
};
