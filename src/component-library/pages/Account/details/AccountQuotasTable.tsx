'use client';

import React, { useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ICellRendererParams } from 'ag-grid-community';
import { HiChevronDown } from 'react-icons/hi';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { ActionCell } from '@/component-library/features/table/cells/ActionCell';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { ClickableRSECell, ClickableRSEExpressionCell } from '@/component-library/features/table/cells/ClickableCellsCollection';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { AgGridMultiSelectFilter, createMultiSelectFilterHandler } from '@/component-library/features/table/filters/AgGridMultiSelectFilter';
import { formatDecimalFileSize } from '@/component-library/features/utils/text-formatters';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import ProgressBar from '@/component-library/atoms/misc/ProgressBar';
import { byteSizeColumn, compareNullsLast } from '@/component-library/features/table/utils/byte-size';
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

export type QuotaState = 'Unlimited' | 'Set' | 'No quota';
export const QUOTA_STATES: QuotaState[] = ['Unlimited', 'Set', 'No quota'];

export const quotaState = (bytesLimit: number | null): QuotaState =>
    bytesLimit === null ? 'No quota' : isUnlimited(bytesLimit) ? 'Unlimited' : 'Set';

/** Usage in percent as a plain number for sorting and filtering. Null for unlimited or no quota. */
export const quotaUsagePercentage = (row?: Pick<QuotaRow, 'bytesUsed' | 'bytesLimit'>): number | null =>
    row ? quotaUsage(row.bytesUsed, row.bytesLimit)?.percentage ?? null : null;

/** Remaining bytes for sorting and filtering: Infinity for Unlimited, null for No quota. */
export const quotaRemainingBytes = (row?: Pick<QuotaRow, 'bytesLimit' | 'bytesUsed' | 'bytesRemaining'>): number | null =>
    row && row.bytesLimit !== null && isUnlimited(row.bytesLimit) ? Infinity : quotaRemainingValue(row);

/** Remaining bytes of a set quota (negative when over). Null for Unlimited and No quota. */
export const quotaRemainingValue = (row?: Pick<QuotaRow, 'bytesLimit' | 'bytesUsed' | 'bytesRemaining'>): number | null => {
    if (!row || row.bytesLimit === null || isUnlimited(row.bytesLimit)) return null;
    return row.bytesRemaining ?? row.bytesLimit - row.bytesUsed;
};

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
            <ClickableRSEExpressionCell value={data.rseExpression} />
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
                        <li key={rse}>
                            <ClickableCell
                                href={`/rse/${encodeURIComponent(rse)}`}
                                className="rounded-full bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-xs font-mono text-neutral-900 dark:text-neutral-100"
                            >
                                {rse}
                            </ClickableCell>
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
    /** Show Edit and Remove on rows that have a quota (admins, when the area's accounts.manage.* flag is on). */
    canManage: boolean;
    /** Edit an existing quota: the dialog is prefilled with these values. */
    onEdit?: (values: AccountLimitTarget & { bytes: number }) => void;
    onDelete?: (target: AccountLimitTarget) => void;
    /** A mutation is running: row actions are disabled. */
    busy?: boolean;
}

interface QuotaColumnOptions {
    locality: AccountLimitLocality;
    canManage: boolean;
    busy: boolean;
    handlers: { current: { onEdit?: AccountQuotasTableProps['onEdit']; onDelete?: AccountQuotasTableProps['onDelete'] } };
}

const numberColumn = { filter: 'agNumberColumnFilter', filterParams: { buttons: ['reset'], maxNumConditions: 1 } };

const searchText = (p: { data?: QuotaRow }) => [p.data?.rseExpression ?? '', ...(p.data?.resolvedRses ?? [])].join(' ');

export const buildQuotaColumnDefs = ({ locality, canManage, busy, handlers }: QuotaColumnOptions) => [
    locality === 'local'
        ? {
              headerName: 'RSE',
              field: 'rseExpression' as const,
              flex: 2,
              minWidth: 180,
              pinned: 'left' as const,
              sort: 'asc' as const,
              cellRenderer: ClickableRSECell,
              filter: true,
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
              filter: true,
              filterParams: DefaultTextFilterParams,
              // Match the RSEs the expression resolves to as well as the expression itself.
              filterValueGetter: searchText,
          },
    byteSizeColumn<QuotaRow>({
        headerName: 'Quota',
        getValue: row => row?.bytesLimit,
        cellRenderer: QuotaLimitCell,
        minWidth: 120,
    }),
    {
        headerName: 'Quota type',
        colId: 'quotaState',
        flex: 1,
        minWidth: 130,
        valueGetter: (p: { data?: QuotaRow }) => (p.data ? quotaState(p.data.bytesLimit) : null),
        filter: { component: AgGridMultiSelectFilter, handler: createMultiSelectFilterHandler<QuotaState>(QUOTA_STATES) },
        filterParams: { options: QUOTA_STATES },
    },
    byteSizeColumn<QuotaRow>({
        headerName: 'Used',
        getValue: row => row?.bytesUsed,
        valueFormatter: p => (p.value === null ? '' : formatDecimalFileSize(p.value)),
    }),
    byteSizeColumn<QuotaRow>({
        headerName: 'Remaining',
        colId: 'remaining',
        getValue: quotaRemainingBytes,
        // Negative remaining is over quota, so -1 must not be read as Unlimited.
        normalized: true,
        cellRenderer: QuotaRemainingCell,
        minWidth: 130,
    }),
    { headerName: 'Files', field: 'files' as const, flex: 1, minWidth: 90, ...numberColumn },
    {
        headerName: 'Usage (%)',
        colId: 'usage',
        flex: 1,
        minWidth: 160,
        cellRenderer: QuotaUsageCell,
        valueGetter: (p: { data?: QuotaRow }) => quotaUsagePercentage(p.data),
        comparator: (a: number | null, b: number | null, _nodeA: unknown, _nodeB: unknown, isDescending: boolean) =>
            compareNullsLast(a, b, isDescending),
        ...numberColumn,
    },
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
                                      variant: 'neutral',
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
];

/** Quotas and usage of one locality: per RSE (local) or per RSE expression (global). */
export const AccountQuotasTable = ({ locality, quotas, canManage, onEdit, onDelete, busy = false }: AccountQuotasTableProps) => {
    const tableRef = useRef<AgGridReact<QuotaRow>>(null);
    // Keep the column definitions stable while the callbacks change identity on every render.
    const handlers = useRef({ onEdit, onDelete });
    handlers.current = { onEdit, onDelete };

    const rows = useMemo(() => toQuotaRows(locality, quotas), [locality, quotas]);

    const columnDefs = useMemo(() => buildQuotaColumnDefs({ locality, canManage, busy, handlers }), [locality, canManage, busy]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} rowData={rows} enableFilterHandlers />;
};
