import { INumberFilterParams } from 'ag-grid-community';

/** Rucio marks an unlimited quota with -1 bytes. */
export const UNLIMITED = -1;

// Base 10 like formatDecimalFileSize and Rucio's CLI sizefmt (1 kB = 1000 B). IEC units (KiB) use 1024.
const UNIT_FACTORS: Record<string, number> = {
    '': 1,
    b: 1,
    byte: 1,
    bytes: 1,
    k: 1e3,
    kb: 1e3,
    mb: 1e6,
    gb: 1e9,
    tb: 1e12,
    pb: 1e15,
    eb: 1e18,
    kib: 1024,
    mib: 1024 ** 2,
    gib: 1024 ** 3,
    tib: 1024 ** 4,
    pib: 1024 ** 5,
    eib: 1024 ** 6,
};

const SIZE_PATTERN = /^(\d+(?:\.\d*)?|\.\d+)\s*([a-z]*)$/i;

/**
 * Parse a size typed by a user: a plain number (bytes) or a number with a unit such as "1 TB", "1.5gb", "500 kB".
 * "unlimited" and "inf" give Infinity. Returns null for anything else.
 */
export const parseByteSize = (input: string): number | null => {
    if (typeof input !== 'string') return null;
    const text = input.trim().toLowerCase();
    if (text === '') return null;
    if (text === 'unlimited' || text === 'inf' || text === 'infinity') return Infinity;
    const match = SIZE_PATTERN.exec(text);
    if (!match) return null;
    const factor = UNIT_FACTORS[match[2]];
    if (factor === undefined) return null;
    const value = parseFloat(match[1]) * factor;
    return Number.isFinite(value) ? value : null;
};

/** Comparable value of a raw byte count: Unlimited (-1) is Infinity, null and undefined are null. */
export const byteSizeValue = (raw: number | null | undefined): number | null => {
    if (raw === null || raw === undefined) return null;
    return raw === UNLIMITED ? Infinity : raw;
};

/**
 * Ascending number comparison with nulls last. AG Grid negates the result for a descending sort,
 * so nulls are flipped there to stay last in both directions.
 */
export const compareNullsLast = (a: number | null | undefined, b: number | null | undefined, isDescending = false): number => {
    if (a === null || a === undefined) return b === null || b === undefined ? 0 : isDescending ? -1 : 1;
    if (b === null || b === undefined) return isDescending ? 1 : -1;
    return a === b ? 0 : a < b ? -1 : 1;
};

/** AG Grid comparator for byte columns: Unlimited is the largest, null is last in both directions. */
export const byteSizeComparator = (
    a: number | null | undefined,
    b: number | null | undefined,
    _nodeA?: unknown,
    _nodeB?: unknown,
    isDescending = false,
): number => compareNullsLast(byteSizeValue(a), byteSizeValue(b), isDescending);

/** Params for agNumberColumnFilter on a byte column: users type "1 TB" instead of 1000000000000. */
export const byteSizeFilterParams: INumberFilterParams = {
    numberParser: (text: string | null) => (text === null ? null : parseByteSize(text)),
    allowedCharPattern: '\\d\\.\\sA-Za-z',
    filterOptions: ['greaterThan', 'lessThan', 'inRange', 'equals', 'blank', 'notBlank'],
    buttons: ['reset'],
    maxNumConditions: 1,
    debounceMs: 300,
};

interface ByteSizeColumnOptions<T> {
    headerName: string;
    /** Raw bytes of a row: -1 is Unlimited, null is not applicable. */
    getValue: (row: T | undefined) => number | null | undefined;
    cellRenderer?: any;
    valueFormatter?: (params: { value: number | null }) => string;
    colId?: string;
    flex?: number;
    minWidth?: number;
}

/** Column definition for a byte size: shared sorting, filtering and a filter value that treats Unlimited as Infinity. */
export const byteSizeColumn = <T>({
    headerName,
    getValue,
    cellRenderer,
    valueFormatter,
    colId,
    flex = 1,
    minWidth = 110,
}: ByteSizeColumnOptions<T>) => ({
    headerName,
    colId,
    flex,
    minWidth,
    cellRenderer,
    valueFormatter,
    valueGetter: (p: { data?: T }) => getValue(p.data) ?? null,
    comparator: byteSizeComparator,
    filterValueGetter: (p: { data?: T }) => byteSizeValue(getValue(p.data)),
    filter: 'agNumberColumnFilter',
    filterParams: byteSizeFilterParams,
});
