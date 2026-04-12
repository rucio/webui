import { LockState } from '@/lib/core/entity/rucio';
import { lockStateComparator } from './rule-sorting-utils';

describe('lockStateComparator', () => {
    describe('with single-character LockState enum values', () => {
        it('sorts STUCK (S) before REPLICATING (R)', () => {
            // comparator returns negative when A should come first (desc sort: priorityB - priorityA < 0 means A has higher priority)
            const result = lockStateComparator(LockState.STUCK, LockState.REPLICATING);
            expect(result).toBeLessThan(0);
        });

        it('sorts REPLICATING (R) before OK (O)', () => {
            const result = lockStateComparator(LockState.REPLICATING, LockState.OK);
            expect(result).toBeLessThan(0);
        });

        it('sorts OK (O) before UNKNOWN (U)', () => {
            const result = lockStateComparator(LockState.OK, LockState.UNKNOWN);
            expect(result).toBeLessThan(0);
        });

        it('sorts STUCK (S) before OK (O)', () => {
            const result = lockStateComparator(LockState.STUCK, LockState.OK);
            expect(result).toBeLessThan(0);
        });

        it('sorts STUCK (S) before UNKNOWN (U)', () => {
            const result = lockStateComparator(LockState.STUCK, LockState.UNKNOWN);
            expect(result).toBeLessThan(0);
        });

        it('returns 0 for equal states', () => {
            expect(lockStateComparator(LockState.STUCK, LockState.STUCK)).toBe(0);
            expect(lockStateComparator(LockState.REPLICATING, LockState.REPLICATING)).toBe(0);
            expect(lockStateComparator(LockState.OK, LockState.OK)).toBe(0);
            expect(lockStateComparator(LockState.UNKNOWN, LockState.UNKNOWN)).toBe(0);
        });

        it('returns positive when lower-priority state is first', () => {
            const result = lockStateComparator(LockState.OK, LockState.STUCK);
            expect(result).toBeGreaterThan(0);
        });
    });

    describe('with full-name string values (compatibility)', () => {
        it('sorts "stuck" before "replicating"', () => {
            const result = lockStateComparator('stuck', 'replicating');
            expect(result).toBeLessThan(0);
        });

        it('sorts "replicating" before "ok"', () => {
            const result = lockStateComparator('replicating', 'ok');
            expect(result).toBeLessThan(0);
        });

        it('returns 0 for equal full-name states', () => {
            expect(lockStateComparator('ok', 'ok')).toBe(0);
            expect(lockStateComparator('stuck', 'stuck')).toBe(0);
        });
    });

    describe('priority ordering', () => {
        it('all four LockState values sort in correct descending order: S > R > O > U', () => {
            const states = [LockState.OK, LockState.UNKNOWN, LockState.STUCK, LockState.REPLICATING];
            const sorted = [...states].sort(lockStateComparator);
            expect(sorted).toEqual([LockState.STUCK, LockState.REPLICATING, LockState.OK, LockState.UNKNOWN]);
        });
    });
});
