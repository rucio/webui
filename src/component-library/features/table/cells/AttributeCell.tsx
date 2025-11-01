import { DateISO } from '@/lib/core/entity/rucio';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import React from 'react';
import { formatDate } from '@/component-library/features/utils/text-formatters';
import { NullBadge } from '@/component-library/features/badges/NullBadge';

const isDateISO = (value: unknown): value is DateISO => {
    if (typeof value !== 'string') return false;
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))$/;
    return isoDateRegex.test(value);
};

export const AttributeCell = ({ value }: { value: string | DateISO | number | boolean | null }) => {
    if (value === null) {
        return <NullBadge />;
    } else if (typeof value === 'boolean') {
        return <Checkbox checked={value} />;
    } else if (isDateISO(value)) {
        return formatDate(value);
    } else {
        return value;
    }
};
