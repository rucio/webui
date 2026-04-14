import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DIDType, DIDFilterOperator } from '@/lib/core/entity/rucio';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { Input } from '@/component-library/atoms/form/input';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { Button } from '@/component-library/atoms/form/button';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { HiFilter } from 'react-icons/hi';
import { DateInput } from '@/component-library/atoms/legacy/input/DateInput/DateInput';
import { TimeInput } from '@/component-library/atoms/legacy/input/TimeInput/TimeInput';
import { Alert } from '@/component-library/atoms/feedback/Alert';

const SCOPE_DELIMITER = ':';
const emptyToastMessage = 'Please specify both scope and name before the search.';
const delimiterToastMessage = 'Neither scope nor name should contain ":".';

export interface DIDSearchParams {
    scope: string;
    name: string;
    type: DIDType;
    limit?: string;
    createdMode?: 'before' | 'after';
    createdDate?: Date;
    createdTime?: string;
    lengthOperator?: DIDFilterOperator;
    lengthValue?: string;
}

interface SearchPanelProps {
    startStreaming: (url: string) => void;
    stopStreaming: () => void;
    initialPattern?: string;
    isRunning: boolean;
    autoSearch?: boolean;
    initialType?: DIDType;
    onSearchStart?: (params: DIDSearchParams) => void;
}

// Helper to convert dates
const dateToRFC1123 = (date: Date | undefined, timeStr: string): string | undefined => {
    if (!date) return undefined;
    const [hours, minutes, seconds] = (timeStr || '00:00:00').split(':').map(Number);

    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, seconds));

    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
        `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
        `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
    );
};

// Map length operator to proper filter key
const mapLengthOperatorToKey = (op: DIDFilterOperator): string => {
    const map: Partial<Record<DIDFilterOperator, string>> = {
        '=': 'length',
        '>': 'length.gt',
        '>=': 'length.gte',
        '<': 'length.lt',
        '<=': 'length.lte',
    };

    const key = map[op];
    if (!key) {
        throw new Error(`Unsupported operator for length: ${op}`);
    }
    return key;
};

// Small reusable wrapper for label + input
const DIDFilterField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col grow">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{label}</label>
        {children}
    </div>
);

export const DIDSearchPanel = (props: SearchPanelProps) => {
    // Try retrieving initial search parameters
    let initialScope: string | undefined, initialName: string | undefined;
    const initialPatternParts = props.initialPattern?.split(SCOPE_DELIMITER);
    if (initialPatternParts && initialPatternParts.length === 2) {
        [initialScope, initialName] = initialPatternParts;
    }

    const [initialPatternError, setInitialPatternError] = useState<string | null>(null);

    // Check the validity of the initial pattern
    useEffect(() => {
        if (props.initialPattern && !initialScope && !initialName) {
            setInitialPatternError(`Invalid URL pattern: could not resolve "${props.initialPattern}"`);
        }
    }, []);

    const [scope, setScope] = useState<string | null>(initialScope ?? null);
    const [name, setName] = useState<string | null>(initialName ?? null);

    const [type, setType] = useState<DIDType>(props.initialType ?? DIDType.DATASET);
    const [limit, setLimit] = useState<string>('');
    const [createdMode, setCreatedMode] = useState<'before' | 'after'>('after');
    const [createdDate, setCreatedDate] = useState<Date | undefined>(undefined);
    const [createdTime, setCreatedTime] = useState<string>('');
    const [lengthOperator, setLengthOperator] = useState<DIDFilterOperator>('=');
    const [lengthValue, setLengthValue] = useState<string>('');

    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const toggleFilters = () => setIsFilterExpanded(prev => !prev);

    const scopeInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();

    const showToastAndFocus = (title: string, description: string, inputRef: React.RefObject<HTMLInputElement | null>) => {
        toast({
            variant: 'warning',
            title,
            description,
        });
        inputRef.current?.focus();
    };

    const validateField = (value: string | null, fieldName: string, inputRef: React.RefObject<HTMLInputElement | null>): boolean => {
        if (!value) {
            showToastAndFocus(`Empty ${fieldName}`, emptyToastMessage, inputRef);
            return false;
        } else if (value.includes(SCOPE_DELIMITER)) {
            showToastAndFocus(`":" in ${fieldName}`, delimiterToastMessage, inputRef);
            return false;
        }
        return true;
    };

    const validateScope = (): boolean => {
        return validateField(scope, 'scope', scopeInputRef);
    };

    const validateName = (): boolean => {
        return validateField(name, 'name', nameInputRef);
    };

    const DIDFilterKeys = {
        limit,
        created: { mode: createdMode, date: createdDate, time: createdTime },
        length: { operator: lengthOperator, value: lengthValue },
    };

    const validateDIDFilters = (type: DIDType, filters: typeof DIDFilterKeys, toast: ReturnType<typeof useToast>['toast']): boolean => {
        const isRFC1123 = (date: string): boolean => !isNaN(Date.parse(date));

        // Validate limit
        if (filters.limit) {
            const num = Number(filters.limit);
            if (!Number.isInteger(num) || num < 0) {
                toast({
                    variant: 'warning',
                    title: 'Invalid limit',
                    description: 'Limit must be a positive integer.',
                });
                return false;
            }
        }

        // Validate created - Date object is always valid if present
        // No validation needed for Date objects from DatePicker

        // Validate length (only for dataset/container)
        if (type === DIDType.CONTAINER || type === DIDType.DATASET) {
            const len = filters.length;
            if (len?.value) {
                const num = Number(len.value);
                if (!Number.isInteger(num)) {
                    toast({
                        variant: 'warning',
                        title: 'Invalid length',
                        description: 'Length must be an integer value.',
                    });
                    return false;
                }
            }
        }

        return true;
    };

    const onSearch = (event: any) => {
        event.preventDefault();

        if (!validateScope() || !validateName() || !validateDIDFilters(type, DIDFilterKeys, toast)) return;

        // Call onSearchStart callback if provided
        if (props.onSearchStart && scope && name) {
            props.onSearchStart({
                scope,
                name,
                type,
                limit: limit || undefined,
                createdMode: createdDate ? createdMode : undefined,
                createdDate: createdDate || undefined,
                createdTime: createdDate ? createdTime : undefined,
                lengthOperator: lengthValue ? lengthOperator : undefined,
                lengthValue: lengthValue || undefined,
            });
        }

        const params = new URLSearchParams({
            query: `${scope}${SCOPE_DELIMITER}${name}`,
            type: type,
        });

        if (limit) {
            params.append('filters', `limit=${limit}`);
        }

        if (createdDate) {
            const createdRFC = dateToRFC1123(createdDate, createdTime);
            if (createdRFC) {
                const key = createdMode === 'before' ? 'created_before' : 'created_after';
                params.append('filters', `${key}=${createdRFC}`);
            }
        }

        if ((type === DIDType.CONTAINER || type === DIDType.DATASET) && lengthValue) {
            const key = mapLengthOperatorToKey(lengthOperator);

            // Convert string to number before passing
            const numLength = Number(lengthValue);
            if (!Number.isNaN(numLength)) {
                params.append('filters', `${key}=${numLength}`);
            }
        }

        const url = '/api/feature/list-dids?' + params.toString();
        props.startStreaming(url);
    };

    const onStop = (event: any) => {
        event.preventDefault();
        props.stopStreaming();
    };

    const onScopeArrowDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowRight') {
            const input = event.currentTarget;
            const cursorPosition = input.selectionStart;
            const textLength = input.value.length;

            // Only switch to name input if cursor is at the end
            if (cursorPosition === textLength) {
                nameInputRef.current?.focus();
            }
        }
    };

    const onNameArrowDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowLeft') {
            const input = event.currentTarget;
            const cursorPosition = input.selectionStart;

            // Only switch to scope input if cursor is at the beginning
            if (cursorPosition === 0) {
                scopeInputRef.current?.focus();
            }
        }
    };

    return (
        <div className="flex flex-col space-y-4 w-full">
            {/* Alert for invalid initial pattern */}
            {initialPatternError && <Alert variant="warning" message={initialPatternError} onClose={() => setInitialPatternError(null)} />}

            {/* Main search row */}
            <div className="flex flex-col md:items-start md:flex-row md:space-y-0 md:space-x-2">
                <div className="flex flex-col grow sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0">
                    <Select onValueChange={value => setType(value as DIDType)} defaultValue={type}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={DIDType.CONTAINER}>Container</SelectItem>
                                <SelectItem value={DIDType.DATASET}>Dataset</SelectItem>
                                <SelectItem value={DIDType.FILE}>File</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className="w-full flex flex-row space-x-2 items-center">
                        <Input
                            ref={scopeInputRef}
                            placeholder="scope"
                            className="max-w-[250px]"
                            defaultValue={initialScope}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setScope(event.target.value);
                            }}
                            onEnterKey={onSearch}
                            onKeyDown={onScopeArrowDown}
                        />
                        <span className="text-neutral-900 dark:text-neutral-100 font-bold">:</span>
                        <Input
                            ref={nameInputRef}
                            placeholder="name"
                            defaultValue={initialName}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setName(event.target.value);
                            }}
                            onEnterKey={onSearch}
                            onKeyDown={onNameArrowDown}
                        />
                        <Button
                            className="px-3"
                            variant="neutral"
                            onClick={toggleFilters}
                            aria-expanded={isFilterExpanded}
                            aria-label="Toggle filters"
                        >
                            <HiFilter />
                            {isFilterExpanded ? <HiChevronUp className="ml-1" /> : <HiChevronDown className="ml-1" />}
                        </Button>
                    </div>
                </div>
                <SearchButton className="sm:w-full md:w-48" isRunning={props.isRunning} onStop={onStop} onSearch={onSearch} />
            </div>

            {/* DID filters */}
            {isFilterExpanded && (
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
                    <DIDFilterField label="Created">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                            <Select value={createdMode} onValueChange={v => setCreatedMode(v as 'before' | 'after')}>
                                <SelectTrigger className="w-full sm:w-32 flex-shrink-0">
                                    <SelectValue placeholder="Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="after">After</SelectItem>
                                        <SelectItem value="before">Before</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className="flex flex-row flex-1 gap-2">
                                <div className="flex-grow-[2]">
                                    <DateInput onchange={(date: Date) => setCreatedDate(date)} initialdate={createdDate} placeholder="Select date" />
                                </div>
                                <div className="flex-grow">
                                    <TimeInput
                                        onchange={(time: string) => setCreatedTime(time)}
                                        initialtime={createdTime}
                                        placeholder="Select time"
                                        showSeconds={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </DIDFilterField>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <DIDFilterField label="Limit">
                            <Input
                                type="number"
                                value={limit}
                                onChange={e => setLimit(e.target.value)}
                                placeholder="Maximum number of DID returned"
                                className="w-full"
                            />
                        </DIDFilterField>
                        {(type === DIDType.CONTAINER || type === DIDType.DATASET) && (
                            <DIDFilterField label="Length">
                                <div className="flex items-center gap-2">
                                    <Select value={lengthOperator} onValueChange={v => setLengthOperator(v as DIDFilterOperator)}>
                                        <SelectTrigger className="w-20 flex-shrink-0">
                                            <SelectValue placeholder="=" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="=">=</SelectItem>
                                                <SelectItem value=">">{'>'}</SelectItem>
                                                <SelectItem value="<">{'<'}</SelectItem>
                                                <SelectItem value=">=">≥</SelectItem>
                                                <SelectItem value="<=">≤</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        value={lengthValue}
                                        onChange={e => setLengthValue(e.target.value)}
                                        placeholder="Number of attached DIDs"
                                        className="w-full"
                                    />
                                </div>
                            </DIDFilterField>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
