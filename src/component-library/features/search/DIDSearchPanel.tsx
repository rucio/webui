import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DIDType, DIDFilterOperator } from '@/lib/core/entity/rucio';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { Input } from '@/component-library/atoms/form/input';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { Button } from '@/component-library/atoms/form/button';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { HiFilter } from 'react-icons/hi';


const SCOPE_DELIMITER = ':';
const emptyToastMessage = 'Please specify both scope and name before the search.';
const delimiterToastMessage = 'Neither scope nor name should contain ":".';

interface SearchPanelProps {
    startStreaming: (url: string) => void;
    stopStreaming: () => void;
    initialPattern?: string;
    isRunning: boolean;
    autoSearch?: boolean;
    initialType?: DIDType;
}

// Helper to convert dates
const dateToRFC1123 = (dateStr: string, timeStr: string): string | undefined => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes, seconds] = (timeStr || '00:00:00').split(':').map(Number);
    if (!year || !month || !day) return undefined;

    const d = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
           `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
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

    // Check the validity of the initial pattern
    useEffect(() => {
        // A short timeout is required for the toast context to initialize
        const timeout = setTimeout(() => {
            if (props.initialPattern && !initialScope && !initialName) {
                toast({
                    variant: 'warning',
                    title: 'Invalid initial pattern',
                    description: `Could not resolve "${props.initialPattern}"`,
                });
            }
        }, 0);

        return () => clearTimeout(timeout);
    }, []);

    const [scope, setScope] = useState<string | null>(initialScope ?? null);
    const [name, setName] = useState<string | null>(initialName ?? null);

    const [type, setType] = useState<DIDType>(props.initialType ?? DIDType.DATASET);
    const [limit, setLimit] = useState<string>('');
    const [createdMode, setCreatedMode] = useState<'before' | 'after'>('after');
    const [createdDate, setCreatedDate] = useState<string>('');
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
            created: {mode: createdMode, date: createdDate, time: createdTime},
            length: { operator: lengthOperator, value: lengthValue }
    };
    
    const validateDIDFilters = (
        type: DIDType,
        filters: typeof DIDFilterKeys,
        toast: ReturnType<typeof useToast>['toast']
        ): boolean => {
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
        
        // Validate created
        if (filters.created.date && isNaN(Date.parse(filters.created.date))) {
            toast({
                variant: 'warning',
                title: 'Invalid created date',
                description: 'Please enter a valid date and time.',
            });
            return false;
        }

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
            nameInputRef.current?.focus();
        }
    };

    const onNameArrowDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowLeft') {
            scopeInputRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-col space-y-4 w-full">
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
                            onInput={(event: ChangeEvent<HTMLInputElement>) => {
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
                            onInput={(event: ChangeEvent<HTMLInputElement>) => {
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
                            <Select
                            value={createdMode}
                            onValueChange={(v) => setCreatedMode(v as 'before' | 'after')}
                            >
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
                            <Input
                                type="date"
                                value={createdDate}
                                onChange={(e) => setCreatedDate(e.target.value)}
                                className="flex-grow-[2]"
                            />
                            <Input
                                type="time"
                                step="1"
                                value={createdTime}
                                onChange={(e) => setCreatedTime(e.target.value)}
                                className="flex-grow"
                            />
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