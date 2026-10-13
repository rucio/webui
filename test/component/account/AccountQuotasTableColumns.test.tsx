import React from 'react';
import {
    buildQuotaColumnDefs,
    compareNullsLast,
    quotaLimitComparator,
    quotaLimitFilterValue,
    quotaRemainingSortKey,
    quotaRemainingValue,
    quotaState,
    quotaUsagePercentage,
} from '@/component-library/pages/Account/details/AccountQuotasTable';

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

describe('quota sort and filter values', () => {
    it('sorts Unlimited as the largest quota and No quota last, in both directions', () => {
        const rows = [null, 5, -1, 10];
        const asc = [...rows].sort((a, b) => quotaLimitComparator(a, b, null, null, false));
        expect(asc).toEqual([5, 10, -1, null]);
        // AG Grid negates the comparator for descending
        const desc = [...rows].sort((a, b) => -quotaLimitComparator(a, b, null, null, true));
        expect(desc).toEqual([-1, 10, 5, null]);
    });

    it('sorts Remaining with Unlimited largest and No quota last', () => {
        const mk = (bytesLimit: number | null, bytesUsed = 0, bytesRemaining: number | null = null) => ({ bytesLimit, bytesUsed, bytesRemaining });
        expect(quotaRemainingSortKey(mk(-1))).toBe(Infinity);
        expect(quotaRemainingSortKey(mk(null))).toBeNull();
        expect(quotaRemainingSortKey(mk(100, 30, 70))).toBe(70);
        expect(quotaRemainingValue(mk(-1))).toBeNull();
        expect(quotaRemainingValue(mk(100, 130, null))).toBe(-30);
        expect(compareNullsLast(null, 1)).toBe(1);
        expect(compareNullsLast(null, 1, true)).toBe(-1);
    });

    it('computes the usage percentage and quota state', () => {
        expect(quotaUsagePercentage({ bytesUsed: 95, bytesLimit: 100 })).toBe(95);
        expect(quotaUsagePercentage({ bytesUsed: 5, bytesLimit: -1 })).toBeNull();
        expect(quotaUsagePercentage({ bytesUsed: 5, bytesLimit: null })).toBeNull();
        expect(quotaState(-1)).toBe('Unlimited');
        expect(quotaState(null)).toBe('No quota');
        expect(quotaState(0)).toBe('Set');
        expect(quotaLimitFilterValue({ bytesLimit: -1 })).toBeNull();
        expect(quotaLimitFilterValue({ bytesLimit: 7 })).toBe(7);
    });
});
