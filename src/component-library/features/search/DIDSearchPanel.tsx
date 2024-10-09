import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DIDType } from '@/lib/core/entity/rucio';
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

    const scopeInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

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

    const onSearch = (event: any) => {
        event.preventDefault();

        if (!validateScope() || !validateName()) return;

        const params = new URLSearchParams({
            query: `${scope}${SCOPE_DELIMITER}${name}`,
            type: type,
        });

        const url = '/api/feature/list-dids?' + params;
        props.startStreaming(url);
    };

    const onStop = (event: any) => {
        event.preventDefault();
        props.stopStreaming();
    };

    return (
        <div className="flex flex-col space-y-2 w-full md:items-start md:flex-row md:space-y-0 md:space-x-2">
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
                    />
                </div>
            </div>
            <SearchButton className="sm:w-full md:w-48" isRunning={props.isRunning} onStop={onStop} onSearch={onSearch} />
        </div>
    );
};
