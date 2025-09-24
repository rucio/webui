import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DIDType, DIDFilterOperator } from '@/lib/core/entity/rucio';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { Input } from '@/component-library/atoms/form/input';
import { SearchButton } from '@/component-library/features/search/SearchButton';

const SCOPE_DELIMITER = ':';
const emptyToastMessage = 'Please specify both scope and name before the search.';
const delimiterToastMessage = 'Neither scope nor name should contain ":".';

interface SearchPanelProps {
    startStreaming: (url: string) => void;
    stopStreaming: () => void;
    initialPattern?: string;
    isRunning: boolean;
}

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
    const [type, setType] = useState<DIDType>(DIDType.DATASET);
    const [DIDFilters, setDIDFilters] = useState([{ key: '', operator: '=' as DIDFilterOperator, value: '' }]);

    const scopeInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const DIDKeyRefs = useRef<(HTMLInputElement | null)[]>([]);
    const DIDValueRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { toast } = useToast();

    const showToastAndFocus = (title: string, description: string, inputRef: React.RefObject<HTMLInputElement>) => {
        toast({
            variant: 'warning',
            title,
            description,
        });
        inputRef.current?.focus();
    };

    const validateField = (value: string | null, fieldName: string, inputRef: React.RefObject<HTMLInputElement>): boolean => {
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

    const validateDIDFilters = (): boolean => {
        for (let i = 0; i < DIDFilters.length; i++) {
            const { key, value } = DIDFilters[i];
            if (!key && !value) continue; // skip empty filters
            if (!key) {
                toast({
                    variant: 'warning',
                    title: 'Empty filter key',
                    description: 'Please specify a key or remove this filter.',
                });
                DIDKeyRefs.current[i]?.focus();
                return false;
            }
            if (!value) {
                toast({
                    variant: 'warning',
                    title: 'Empty filter value',
                    description: 'Please specify a value or remove this filter.',
                });
                DIDValueRefs.current[i]?.focus();
                return false;
            }
        }
        return true;
    };

    const onSearch = (event: any) => {
        event.preventDefault();

        if (!validateScope() || !validateName() || !validateDIDFilters()) return;

        const params = new URLSearchParams({
            query: `${scope}${SCOPE_DELIMITER}${name}`,
            type: type,
        });

        // Include DID filters only if key and value are present
        DIDFilters.filter(f => f.key && f.value).forEach(f => {
            params.append('filters', `${f.key}${f.operator}${f.value}`);
        });

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

    const addDIDFilter = () => setDIDFilters([...DIDFilters, { key: '', operator: '=', value: '' }]);
    const updateDIDFilter = (idx: number, field: 'key' | 'operator' | 'value', val: string | DIDFilterOperator) => {
        setDIDFilters(DIDFilters.map((f, i) => i === idx ? { ...f, [field]: val } : f));
    };
    const removeDIDFilter = (idx: number) => {
        setDIDFilters(DIDFilters.filter((_, i) => i !== idx));
        DIDKeyRefs.current.splice(idx, 1);
        DIDValueRefs.current.splice(idx, 1);
    };

    return (
        <div className="flex flex-col space-y-2 w-full">
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
                    </div>
                </div>
                <SearchButton className="sm:w-full md:w-48" isRunning={props.isRunning} onStop={onStop} onSearch={onSearch} />
            </div>

            {/* DID filters row */}
            <div className="flex flex-wrap items-center gap-2">
                {DIDFilters.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2">
                        <Input
                            placeholder="Key"
                            value={f.key}
                            onChange={e => updateDIDFilter(i, 'key', e.target.value)}
                            className="w-34"
                            ref={el => (DIDKeyRefs.current[i] = el)}
                        />
                        <Select
                            value={f.operator}
                            onValueChange={(value: DIDFilterOperator) => updateDIDFilter(i, 'operator', value)}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue placeholder="=" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="=">=</SelectItem>
                                    <SelectItem value="!=">!=</SelectItem>
                                    <SelectItem value=">">{ ">" }</SelectItem>
                                    <SelectItem value="<">{ "<" }</SelectItem>
                                    <SelectItem value=">=">≥</SelectItem>
                                    <SelectItem value="<=">≤</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Value"
                            value={f.value}
                            onChange={e => updateDIDFilter(i, 'value', e.target.value)}
                            className="w-34"
                            ref={el => (DIDValueRefs.current[i] = el)}
                        />
                        <button
                            onClick={() => removeDIDFilter(i)}
                            disabled={DIDFilters.length === 1}
                            className="px-2 text-white-500 hover:text-white-700 disabled:opacity-30"
                        >
                            -
                        </button>
                    </div>
                ))}
                <button
                    onClick={addDIDFilter}
                    className="text-sm text-blue-500 hover:text-blue-700"
                >
                    + Add Filter
                </button>
            </div>
        </div>
    );
};
