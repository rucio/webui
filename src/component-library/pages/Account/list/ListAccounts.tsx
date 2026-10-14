'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { HiChevronDown, HiInformationCircle } from 'react-icons/hi2';
import { HiPlus } from 'react-icons/hi';
import { cn } from '@/component-library/utils';
import { Button } from '@/component-library/atoms/form/button';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { CreateAccountDialog, CreateAccountValues } from '@/component-library/features/mutations/account/CreateAccountDialog';
import { useFeature } from '@/component-library/features/feature-flags/FeatureProvider';
import { AccountListItemViewModel, CreateAccountViewModel } from '@/lib/infrastructure/data/view-model/account';
import { StreamingErrorType, StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { usePermissions } from '@/lib/infrastructure/hooks/usePermissions';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { isValidAccountName } from '@/lib/core/utils/account-validation';
import { ListAccountsTable, accountHref } from './ListAccountsTable';
import { ListAccountsFilters, AccountFilters, ALL_TYPES } from './ListAccountsFilters';
import { ListAccountsTips } from './ListAccountsTips';
import { sendMutation } from '../account-fetch';

const PATH = '/accounts';

const filtersFromParams = (params: Pick<URLSearchParams, 'get'>): AccountFilters => ({
    account: params.get('account') ?? '',
    type: params.get('type') ?? ALL_TYPES,
    identity: params.get('identity') ?? '',
});

/** The page URL query string mirroring the filters (empty filters are omitted). */
export const pageQuery = (f: AccountFilters): string => {
    const p = new URLSearchParams();
    if (f.account) p.set('account', f.account);
    if (f.type !== ALL_TYPES) p.set('type', f.type);
    if (f.identity) p.set('identity', f.identity);
    return p.toString();
};

/** The streaming endpoint URL for the filters. */
export const streamUrl = (f: AccountFilters): string => {
    const p = new URLSearchParams();
    if (f.account) p.set('account', f.account);
    if (f.type !== ALL_TYPES) p.set('accountType', f.type);
    if (f.identity) p.set('identity', f.identity);
    const q = p.toString();
    return `/api/feature/list-accounts${q ? `?${q}` : ''}`;
};

export const ListAccounts = () => {
    const router = useRouter();
    const pathname = usePathname() ?? PATH;
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { update: updateSession } = useSession();
    // Permissions are set up after the session loads: until then, hide Create instead of checking too early.
    const { check, isReady } = usePermissions();
    const manageEnabled = useFeature('accounts.manage');
    const canCreate = isReady && manageEnabled && check('account', 'lifecycle');

    const { onGridReady, streamingHook, startStreaming, stopStreaming, gridApi } = useTableStreaming<AccountListItemViewModel>();
    const [filters, setFilters] = useState<AccountFilters>(() => filtersFromParams(searchParams ?? new URLSearchParams()));
    const [searched, setSearched] = useState<AccountFilters>(filters);
    const [finishedEmpty, setFinishedEmpty] = useState(false);
    const [isTipsOpen, setIsTipsOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [createError, setCreateError] = useState<string | undefined>();

    const { status, error } = streamingHook;
    const isRunning = status === StreamingStatus.RUNNING;

    const userStopped = useRef(false);
    const onStop = () => {
        userStopped.current = true;
        stopStreaming();
    };

    const search = (f: AccountFilters, updateUrl: boolean) => {
        if (updateUrl) {
            const q = pageQuery(f);
            router.replace(q ? `${pathname}?${q}` : pathname);
        }
        setSearched(f);
        setFinishedEmpty(false);
        userStopped.current = false;
        startStreaming(streamUrl(f));
    };

    // Auto-start once the grid is ready, using the filters from the URL.
    const started = useRef(false);
    useEffect(() => {
        if (gridApi && !started.current) {
            started.current = true;
            search(filters, false);
        }
    }, [gridApi]);

    // Note when a finished stream produced no rows.
    const wasRunning = useRef(false);
    useEffect(() => {
        if (isRunning) {
            wasRunning.current = true;
            return;
        }
        if (!wasRunning.current) return;
        wasRunning.current = false;
        // A manual stop leaves a partial (possibly empty) grid, not a finished search.
        if (userStopped.current) return;
        // BAD_METHOD_CALL only means a start was attempted while a stream was already
        // running (useTableStreaming also toasts that), so the running stream is unaffected.
        if (error && error.type !== StreamingErrorType.NOT_FOUND) return;
        gridApi?.flushAsyncTransactions();
        setFinishedEmpty((gridApi?.getDisplayedRowCount() ?? 0) === 0);
    }, [isRunning, error]);

    const createMutation = useMutation({
        mutationFn: async (values: CreateAccountValues) => {
            await sendMutation<CreateAccountViewModel>('create-account', 'POST', values);
            return values.account;
        },
        onSuccess: account => {
            setCreateOpen(false);
            toast({ variant: 'success', title: 'Account created', description: 'Add an identity so someone can log in.' });
            router.push(`${accountHref(account)}?tab=identities`);
        },
        onError: (vm: CreateAccountViewModel) => {
            setCreateError(vm?.message || 'The Rucio server rejected the request.');
            // A stale admin role in the session corrects itself.
            if (vm?.errorType === 'permission_denied') void updateSession();
        },
    });

    const openName = searched.account;
    const offerDirectOpen = finishedEmpty && !isRunning && isValidAccountName(openName);
    const streamFailed = !!error && error.type !== StreamingErrorType.NOT_FOUND && error.type !== StreamingErrorType.BAD_METHOD_CALL;

    return (
        <div className="flex flex-col space-y-6 w-full">
            {canCreate && (
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setCreateError(undefined);
                            setCreateOpen(true);
                        }}
                    >
                        <HiPlus className="mr-1 h-4 w-4" aria-hidden="true" />
                        Create account
                    </Button>
                </div>
            )}

            <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 text-sm text-base-info-700 dark:text-base-info-200">
                <button
                    type="button"
                    className="flex w-full items-center gap-2 p-3 text-left"
                    onClick={() => setIsTipsOpen(prev => !prev)}
                    aria-expanded={isTipsOpen}
                >
                    <HiInformationCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="font-medium flex-1">Tips</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isTipsOpen && 'rotate-180')}
                        aria-hidden="true"
                    />
                </button>
                {isTipsOpen && <ListAccountsTips />}
            </div>

            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs p-6">
                <ListAccountsFilters
                    filters={filters}
                    onChange={setFilters}
                    onSearch={() => search(filters, true)}
                    onStop={onStop}
                    isRunning={isRunning}
                />
            </div>

            {streamFailed && (
                <WarningField>
                    <span className="flex-1">{error?.message || 'Something went wrong while loading accounts.'}</span>
                    <Button variant="neutral" size="sm" onClick={() => search(searched, false)}>
                        Retry
                    </Button>
                </WarningField>
            )}

            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden h-[calc(100vh-24rem)]">
                <ListAccountsTable streamingHook={streamingHook} onGridReady={onGridReady} />
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400">Only active accounts are listed.</p>
            {offerDirectOpen && (
                <InfoField>
                    <span>
                        No active account matches.{' '}
                        <Link href={accountHref(openName)} className="font-medium underline underline-offset-2">
                            Open {openName} directly
                        </Link>
                    </span>
                </InfoField>
            )}

            {canCreate && (
                <CreateAccountDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    onSubmit={values => createMutation.mutate(values)}
                    loading={createMutation.isPending}
                    error={createError}
                />
            )}
        </div>
    );
};
