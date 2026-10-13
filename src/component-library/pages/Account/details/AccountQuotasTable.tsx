'use client';

import React, { useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ICellRendererParams } from 'ag-grid-community';
import { HiChevronDown } from 'react-icons/hi';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { ActionCell } from '@/component-library/features/table/cells/ActionCell';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { formatDecimalFileSize } from '@/component-library/features/utils/text-formatters';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import ProgressBar from '@/component-library/atoms/misc/ProgressBar';
import { cn } from '@/component-library/utils';
import { AccountGlobalQuota, AccountLimitLocality, AccountLocalQuota, UNLIMITED_BYTES } from '@/lib/core/entity/account';
import { AccountLimitTarget } from './details-account-types';

/** One row of either table: the RSE (local) or the RSE expression (global) is `rseExpression`. */
export interface QuotaRow {
    rseExpression: string;
    resolvedRses?: string[];
    bytesLimit: number | null;
    bytesUsed: number;
    files: number;
    bytesRemaining: number | null;
}

export type QuotaUsageVariant = 'success' | 'warning' | 'error';

/**
 * Usage of a quota in percent with its colour: warning above 90 percent, error at or above 100.
 * Null for unlimited (-1) or no quota (null), where a bar means nothing.
 */
export const quotaUsage = (bytesUsed: number, bytesLimit: number | null): { percentage: number; variant: QuotaUsageVariant } | null => {
    if (bytesLimit === null || bytesLimit < 0) return null;
    // A zero quota is full from the start.
    const percentage = bytesLimit === 0 ? 100 : (bytesUsed / bytesLimit) * 100;
    const variant: QuotaUsageVariant = percentage >= 100 ? 'error' : percentage > 90 ? 'warning' : 'success';
    return { percentage, variant };
};

const isUnlimited = (bytes: number | null) => bytes !== null && bytes <= UNLIMITED_BYTES;

export const QuotaLimitCell = ({ value }: { value: number | null }) => {
    if (value === null) return <NullBadge label="No quota" />;
    if (isUnlimited(value)) return <span>Unlimited</span>;
    return <span>{formatDecimalFileSize(value)}</span>;
};

export const QuotaRemainingCell = ({ data }: { data?: Pick<QuotaRow, 'bytesLimit' | 'bytesUsed' | 'bytesRemaining'> }) => {
    if (!data || data.bytesLimit === null) return <NullBadge label="none" />;
    if (isUnlimited(data.bytesLimit)) return <span>Unlimited</span>;
    const remaining = data.bytesRemaining ?? data.bytesLimit - data.bytesUsed;
    if (remaining < 0) return <span className="text-base-error-600 dark:text-base-error-400">Over by {formatDecimalFileSize(-remaining)}</span>;
    return <span>{formatDecimalFileSize(remaining)}</span>;
};

export const QuotaUsageCell = ({ data }: { data?: Pick<QuotaRow, 'bytesUsed' | 'bytesLimit'> }) => {
    const usage = data ? quotaUsage(data.bytesUsed, data.bytesLimit) : null;
    if (!usage) return null;
    const label = `${Math.round(usage.percentage)}%`;
    return (
        <div className="flex items-center gap-2 h-full">
            <ProgressBar percentage={usage.percentage} variant={usage.variant} size="sm" aria-label={`${label} of the quota used`} />
            <span className="text-xs tabular-nums w-12 text-right">{label}</span>
        </div>
    );
};

/** A global quota's RSE expression; expands to show the RSEs it resolves to as chips. */
export const ResolvedRsesCell = ({ data }: { data?: Pick<QuotaRow, 'rseExpression' | 'resolvedRses'> }) => {
    const [open, setOpen] = useState(false);
    if (!data) return null;
    const rses = data.resolvedRses ?? [];
    return (
        <div className="flex flex-col gap-1 py-2 leading-normal">
            <span className="font-mono break-all">{data.rseExpression}</span>
            {rses.length > 0 && (
                <button
                    type="button"
                    onClick={() => setOpen(prev => !prev)}
                    aria-expanded={open}
                    className="flex items-center gap-1 w-fit text-xs text-brand-600 dark:text-brand-400 hover:underline"
                >
                    <HiChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} aria-hidden="true" />
                    {rses.length} {rses.length === 1 ? 'RSE' : 'RSEs'}
                </button>
            )}
            {open && (
                <ul className="flex flex-wrap gap-1">
                    {rses.map(rse => (
                        <li
                            key={rse}
                            className="rounded-full bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-xs font-mono text-neutral-900 dark:text-neutral-100"
                        >
                            {rse}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export const toQuotaRows = (locality: AccountLimitLocality, quotas: AccountLocalQuota[] | AccountGlobalQuota[]): QuotaRow[] =>
    locality === 'local'
        ? (quotas as AccountLocalQuota[]).map(q => ({ ...q, rseExpression: q.rse }))
        : (quotas as AccountGlobalQuota[]).map(q => ({ ...q }));

export interface AccountQuotasTableProps {
    locality: AccountLimitLocality;
    quotas: AccountLocalQuota[] | AccountGlobalQuota[];
    /** Show Edit and Remove on rows that have a quota (admins with accounts.manage). */
    canManage: boolean;
    /** Edit an existing quota: the dialog is prefilled with these values. */
    onEdit?: (values: AccountLimitTarget & { bytes: number }) => void;
    onDelete?: (target: AccountLimitTarget) => void;
    /** A mutation is running: row actions are disabled. */
    busy?: boolean;
}

/** Quotas and usage of one locality: per RSE (local) or per RSE expression (global). */
export const AccountQuotasTable = ({ locality, quotas, canManage, onEdit, onDelete, busy = false }: AccountQuotasTableProps) => {
    const tableRef = useRef<AgGridReact<QuotaRow>>(null);
    // Keep the column definitions stable while the callbacks change identity on every render.
    const handlers = useRef({ onEdit, onDelete });
    handlers.current = { onEdit, onDelete };

    const rows = useMemo(() => toQuotaRows(locality, quotas), [locality, quotas]);

    const columnDefs = useMemo(
        () => [
            locality === 'local'
                ? {
                      headerName: 'RSE',
                      field: 'rseExpression' as const,
                      flex: 2,
                      minWidth: 180,
                      pinned: 'left' as const,
                      sort: 'asc' as const,
                      filterParams: DefaultTextFilterParams,
                  }
                : {
                      headerName: 'Expression',
                      field: 'rseExpression' as const,
                      flex: 2,
                      minWidth: 220,
                      pinned: 'left' as const,
                      sort: 'asc' as const,
                      autoHeight: true,
                      cellRenderer: ResolvedRsesCell,
                      filterParams: DefaultTextFilterParams,
                  },
            { headerName: 'Quota', field: 'bytesLimit' as const, flex: 1, minWidth: 120, cellRenderer: QuotaLimitCell, filter: false },
            {
                headerName: 'Used',
                field: 'bytesUsed' as const,
                flex: 1,
                minWidth: 110,
                valueFormatter: (p: { value: number }) => formatDecimalFileSize(p.value),
                filter: false,
            },
            { headerName: 'Remaining', colId: 'remaining', flex: 1, minWidth: 130, cellRenderer: QuotaRemainingCell, filter: false, sortable: false },
            { headerName: 'Files', field: 'files' as const, flex: 1, minWidth: 90, filter: false },
            { headerName: 'Usage', colId: 'usage', flex: 1, minWidth: 160, cellRenderer: QuotaUsageCell, filter: false, sortable: false },
            ...(canManage
                ? [
                      {
                          headerName: '',
                          colId: 'actions',
                          width: 170,
                          flex: 0,
                          sortable: false,
                          filter: false,
                          floatingFilter: false,
                          cellRenderer: (params: ICellRendererParams<QuotaRow>) => {
                              const row = params.data;
                              // Rows without a quota only show usage; "Set quota" adds one.
                              if (!row || row.bytesLimit === null) return null;
                              const target = { locality, rseExpression: row.rseExpression };
                              return (
                                  <ActionCell
                                      actions={[
                                          {
                                              label: 'Edit',
                                              icon: 'edit',
                                              disabled: busy,
                                              onClick: () => handlers.current.onEdit?.({ ...target, bytes: row.bytesLimit as number }),
                                          },
                                          {
                                              label: 'Remove',
                                              icon: 'delete',
                                              variant: 'error',
                                              disabled: busy,
                                              onClick: () => handlers.current.onDelete?.(target),
                                          },
                                      ]}
                                  />
                              );
                          },
                      },
                  ]
                : []),
        ],
        // busy is a dependency so AG Grid re-renders the action cells when it changes
        [locality, canManage, busy],
    );

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} rowData={rows} />;
};
