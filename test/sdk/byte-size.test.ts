import { byteSizeComparator, byteSizeValue, compareNullsLast, parseByteSize } from '@/component-library/features/table/utils/byte-size';

describe('parseByteSize', () => {
    it('parses plain numbers as bytes', () => {
        expect(parseByteSize('0')).toBe(0);
        expect(parseByteSize('1')).toBe(1);
        expect(parseByteSize('1000000000000')).toBe(1e12);
    });

    it('parses base 10 units, case-insensitive, with optional space', () => {
        expect(parseByteSize('1 kB')).toBe(1000);
        expect(parseByteSize('1KB')).toBe(1000);
        expect(parseByteSize('2 mb')).toBe(2e6);
        expect(parseByteSize('3gb')).toBe(3e9);
        expect(parseByteSize('1 TB')).toBe(1e12);
        expect(parseByteSize('1 pB')).toBe(1e15);
        expect(parseByteSize('1 EB')).toBe(1e18);
        expect(parseByteSize('5 B')).toBe(5);
        expect(parseByteSize('  7 tb  ')).toBe(7e12);
    });

    it('parses decimals', () => {
        expect(parseByteSize('1.5 TB')).toBe(1.5e12);
        expect(parseByteSize('.5gb')).toBe(5e8);
    });

    it('uses 1024 for IEC units', () => {
        expect(parseByteSize('1 KiB')).toBe(1024);
        expect(parseByteSize('1 GiB')).toBe(1024 ** 3);
    });

    it('maps unlimited and inf to Infinity', () => {
        expect(parseByteSize('unlimited')).toBe(Infinity);
        expect(parseByteSize('Unlimited')).toBe(Infinity);
        expect(parseByteSize('inf')).toBe(Infinity);
    });

    it('returns null for invalid input', () => {
        for (const bad of ['', '  ', 'abc', 'TB', '1 XB', '1 T B', '-5', '1..2 GB', '1,5 GB', '1 TB extra']) {
            expect(parseByteSize(bad)).toBeNull();
        }
    });
});

describe('byteSizeValue', () => {
    it('maps Unlimited to Infinity and missing values to null', () => {
        expect(byteSizeValue(-1)).toBe(Infinity);
        expect(byteSizeValue(null)).toBeNull();
        expect(byteSizeValue(undefined)).toBeNull();
        expect(byteSizeValue(0)).toBe(0);
        expect(byteSizeValue(42)).toBe(42);
    });
});

describe('byteSizeComparator', () => {
    const values = [null, 1000, -1, 1, 5e12, null, 0];
    // AG Grid negates the comparator result for a descending sort
    const asc = [...values].sort((a, b) => byteSizeComparator(a, b, null, null, false));
    const desc = [...values].sort((a, b) => -byteSizeComparator(a, b, null, null, true));

    it('sorts ascending with Unlimited largest and null last', () => {
        expect(asc).toEqual([0, 1, 1000, 5e12, -1, null, null]);
    });

    it('sorts descending with Unlimited first and null still last', () => {
        expect(desc).toEqual([-1, 5e12, 1000, 1, 0, null, null]);
    });

    it('orders 1 byte before 1 kB', () => {
        expect(byteSizeComparator(1, 1000)).toBe(-1);
        expect(byteSizeComparator(1000, 1)).toBe(1);
        expect(byteSizeComparator(7, 7)).toBe(0);
    });

    it('treats two nulls as equal', () => {
        expect(byteSizeComparator(null, undefined)).toBe(0);
    });
});

describe('compareNullsLast', () => {
    it('flips null placement for descending', () => {
        expect(compareNullsLast(null, 1)).toBe(1);
        expect(compareNullsLast(null, 1, true)).toBe(-1);
        expect(compareNullsLast(1, null)).toBe(-1);
        expect(compareNullsLast(1, null, true)).toBe(1);
    });
});
