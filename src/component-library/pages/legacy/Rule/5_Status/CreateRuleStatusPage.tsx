import { Alert } from '@/component-library/atoms/legacy/Alert/Alert';
import { NormalTable } from '@/component-library/features/legacy/StreamedTables/NormalTable';
import { CreateRulesViewModel, TRuleIDDIDPair } from '@/lib/infrastructure/data/view-model/create-rule';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type TCreateRuleStatusPageProps = {
    createRuleViewModel: CreateRulesViewModel | undefined;
};

export const CreateRuleStatusPage = ({ createRuleViewModel }: TCreateRuleStatusPageProps) => {
    const columnHelper = createColumnHelper<TRuleIDDIDPair>();
    const tablecolumns: any[] = [
        columnHelper.accessor('RuleID', {
            id: 'RuleID',
            header: info => {
                return (
                    <div className="text-xl text-left text-text-100">
                        <span>Rule ID</span>
                    </div>
                );
            },
            cell: info => {
                return (
                    <div className="flex flex-col text-left dark:text-text-0 text-text-1000">
                        <Link
                            className={twMerge('text-brand-500 hover:text-brand-700', 'dark:text-brand-400 dark:hover:text-brand-300')}
                            href={`/rule/page/${info.getValue()}`}
                        >
                            {info.getValue()}
                        </Link>
                    </div>
                );
            },
        }),
        columnHelper.accessor('DID', {
            id: 'DID',
            header: info => {
                return (
                    <div className="text-xl text-left text-text-100 ">
                        <span>DID</span>
                    </div>
                );
            },
            cell: info => {
                return (
                    <div className="flex flex-col text-left dark:text-text-0 text-text-1000">
                        <span>{info.getValue()}</span>
                    </div>
                );
            },
        }),
    ];
    // Handle Loading State
    if (!createRuleViewModel || createRuleViewModel.status === 'pending')
        return (
            <div
                className={twMerge(
                    'flex flex-col items-center space-y-4',
                    'w-full h-full',
                    'p-2',
                    'bg-neutral-0 dark:bg-neutral-800',
                    'dark:text-text-0 text-text-1000',
                )}
            >
                <div className="flex items-center justify-center w-56 h-56 ">
                    <div className="px-3 py-1 text-xs font-medium leading-none text-center text-brand-800 bg-neutral-200 rounded-full animate-pulse dark:bg-neutral-900 dark:text-brand-200">
                        loading...
                    </div>
                </div>
            </div>
        );
    // Handle errors
    if (createRuleViewModel.status === 'error') {
        const errorMessage = createRuleViewModel.message;
        return (
            <div
                className={twMerge(
                    'flex flex-col space-y-4',
                    'w-full h-full',
                    'p-2',
                    'bg-neutral-0 dark:bg-neutral-800',
                    'dark:text-text-0 text-text-1000 ',
                )}
            >
                <Alert variant="error" message="Oops! Something went wrong." />
                <div className={twMerge('border rounded-md p-1', 'bg-neutral-0 dark:bg-neutral-800', 'text-base-error-500')}>{errorMessage}</div>
            </div>
        );
    }
    // Handle Success
    return (
        <div
            className={twMerge(
                'flex flex-col space-y-4',
                'w-full h-full',
                'p-2',
                'bg-neutral-0 dark:bg-neutral-800',
                'dark:text-text-0 text-text-1000',
            )}
        >
            <Alert variant="success" message="Your rule(s) have been created. " />
            <NormalTable
                tablecolumns={tablecolumns}
                tabledata={createRuleViewModel.rules}
                tablestyling={{
                    tableHeadRowStyle: 'border-b border-neutral-300 bg-neutral-700 dark:bg-neutral-800',
                    tableBodyRowStyle: twMerge(
                        'bg-neutral-0 odd:bg-neutral-100 text-text-1000',
                        'dark:bg-neutral-700 odd:dark:bg-neutral-800 dark:text-text-100',
                        'border-b border-neutral-300',
                    ),
                }}
            />
            <div>
                You can also view all your rules by clicking&nbsp;
                <Link className={twMerge('text-brand-500 hover:text-brand-700', 'dark:text-brand-400 dark:hover:text-brand-300')} href="/rule/list">
                    here.
                </Link>
            </div>
        </div>
    );
};
