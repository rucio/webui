import React from 'react';
import {
    buildQuotaColumnDefs,
    quotaRemainingBytes,
    quotaRemainingValue,
    quotaState,
    quotaUsagePercentage,
} from '@/component-library/pages/Account/details/AccountQuotasTable';
import { byteSizeComparator, byteSizeFilterParams, normalizedByteSizeComparator } from '@/component-library/features/table/utils/byte-size';

const handlers = { current: {} };
const cols = (locality: 'local' | 'global', canManage = true) => buildQuotaColumnDefs({ locality, canManage, busy: false, handlers }) as any[];
const byName = (defs: any[], name: string) => defs.find(c => c.headerName === name);

describe('quota column definitions', () => {
    it('uses the right filter per column and keeps every data column sortable', () => {
        const defs = cols('local');
        expect(byName(defs, 'RSE').filter).toBe(true);
        expect(byName(defs, 'RSE').filterParams.filterOptions).toEqual(['contains']);
        for (const name of ['Quota', 'Used', 'Remaining', 'Files', 'Usage (%)']) {
            expect(byName(defs, name).filter).toBe('agNumberColumnFilter');
            expect(byName(defs, name).sortable).not.toBe(false);
        }
        expect(byName(defs, 'Quota type').filter.component).toBeDefined();
        expect(byName(defs, 'Quota type').filterParams.options).toEqual(['Unlimited', 'Set', 'No quota']);
    });

    it('keeps the actions column unsortable and unfilterable, and only for managers', () => {
        const actions = cols('local').find(c => c.colId === 'actions');
        expect(actions.sortable).toBe(false);
        expect(actions.filter).toBe(false);
        expect(cols('local', false).find(c => c.colId === 'actions')).toBeUndefined();
    });

    it('searches resolved RSEs in the global expression column', () => {
        const col = byName(cols('global'), 'Expression');
        const data = { rseExpression: 'tier=1', resolvedRses: ['BNL', 'CERN'] };
        expect(col.filterValueGetter({ data })).toContain('CERN');
        expect(col.filterValueGetter({ data })).toContain('tier=1');
    });
});

const mk = (bytesLimit: number | null, bytesUsed = 0, bytesRemaining: number | null = null) => ({
    rseExpression: 'X',
    files: 0,
    bytesLimit,
    bytesUsed,
    bytesRemaining,
});
const sortAsc = (col: any, rows: any[], pick: (r: any) => any) =>
    [...rows].sort((x, y) => col.comparator(pick(x), pick(y), { data: x }, { data: y }, false));
// AG Grid negates the comparator result for a descending sort
const sortDesc = (col: any, rows: any[], pick: (r: any) => any) =>
    [...rows].sort((x, y) => -col.comparator(pick(x), pick(y), { data: x }, { data: y }, true));
const getter = (col: any, row: any) => col.valueGetter({ data: row });

describe('byte size columns', () => {
    const defs = cols('local');

    it('uses the shared comparator and byte size filter params on Quota, Used and Remaining', () => {
        for (const name of ['Quota', 'Used', 'Remaining']) {
            expect(byName(defs, name).filterParams).toBe(byteSizeFilterParams);
        }
        expect(byName(defs, 'Quota').comparator).toBe(byteSizeComparator);
        expect(byName(defs, 'Remaining').comparator).toBe(normalizedByteSizeComparator);
    });

    it('sorts Quota with Unlimited largest and No quota last, in both directions', () => {
        const col = byName(defs, 'Quota');
        const rows = [mk(null), mk(5), mk(-1), mk(10)];
        const pick = (r: any) => getter(col, r);
        expect(sortAsc(col, rows, pick).map(r => r.bytesLimit)).toEqual([5, 10, -1, null]);
        expect(sortDesc(col, rows, pick).map(r => r.bytesLimit)).toEqual([-1, 10, 5, null]);
    });

    it('sorts Remaining with Unlimited largest and No quota last, in both directions', () => {
        const col = byName(defs, 'Remaining');
        const rows = [mk(null), mk(100, 30, 70), mk(-1), mk(100, 130, null)];
        const pick = (r: any) => getter(col, r);
        expect(sortAsc(col, rows, pick).map(r => getter(col, r))).toEqual([-30, 70, Infinity, null]);
        expect(sortDesc(col, rows, pick).map(r => getter(col, r))).toEqual([Infinity, 70, -30, null]);
    });

    it('keeps over by 1 byte distinct from Unlimited on Remaining', () => {
        const col = byName(defs, 'Remaining');
        const overByOne = mk(100, 101, -1);
        expect(col.filterValueGetter({ data: overByOne })).toBe(-1);
        expect(col.filterValueGetter({ data: mk(100, 101, null) })).toBe(-1);
        const rows = [mk(null), overByOne, mk(-1), mk(100, 50, 50)];
        const pick = (r: any) => getter(col, r);
        expect(sortAsc(col, rows, pick).map(pick)).toEqual([-1, 50, Infinity, null]);
        expect(sortDesc(col, rows, pick).map(pick)).toEqual([Infinity, 50, -1, null]);
    });

    it('sorts Used in both directions', () => {
        const col = byName(defs, 'Used');
        const rows = [mk(1, 1000), mk(1, 1), mk(1, 0)];
        const pick = (r: any) => getter(col, r);
        expect(sortAsc(col, rows, pick).map(r => r.bytesUsed)).toEqual([0, 1, 1000]);
        expect(sortDesc(col, rows, pick).map(r => r.bytesUsed)).toEqual([1000, 1, 0]);
    });

    it('filters with Unlimited as Infinity and No quota as blank', () => {
        const quota = byName(defs, 'Quota');
        expect(quota.filterValueGetter({ data: mk(-1) })).toBe(Infinity);
        expect(quota.filterValueGetter({ data: mk(null) })).toBeNull();
        expect(quota.filterValueGetter({ data: mk(7) })).toBe(7);
        expect(byName(defs, 'Remaining').filterValueGetter({ data: mk(-1) })).toBe(Infinity);
    });
});

describe('usage column', () => {
    it('sorts Usage with Unlimited and No quota last, in both directions', () => {
        const col = byName(cols('local'), 'Usage (%)');
        const rows = [mk(null), mk(100, 95), mk(-1), mk(100, 10)];
        const pick = (r: any) => col.valueGetter({ data: r });
        expect(sortAsc(col, rows, pick).map(pick)).toEqual([10, 95, null, null]);
        expect(sortDesc(col, rows, pick).map(pick)).toEqual([95, 10, null, null]);
    });
});

describe('quota values', () => {
    it('computes remaining bytes', () => {
        expect(quotaRemainingBytes(mk(-1))).toBe(Infinity);
        expect(quotaRemainingBytes(mk(null))).toBeNull();
        expect(quotaRemainingBytes(mk(100, 30, 70))).toBe(70);
        expect(quotaRemainingValue(mk(-1))).toBeNull();
        expect(quotaRemainingValue(mk(100, 130, null))).toBe(-30);
    });

    it('computes the usage percentage and quota state', () => {
        expect(quotaUsagePercentage({ bytesUsed: 95, bytesLimit: 100 })).toBe(95);
        expect(quotaUsagePercentage({ bytesUsed: 5, bytesLimit: -1 })).toBeNull();
        expect(quotaUsagePercentage({ bytesUsed: 5, bytesLimit: null })).toBeNull();
        expect(quotaState(-1)).toBe('Unlimited');
        expect(quotaState(null)).toBe('No quota');
        expect(quotaState(0)).toBe('Set');
    });
});
