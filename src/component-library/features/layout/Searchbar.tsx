import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Input } from '@/component-library/atoms/form/input';
import { cn } from '@/component-library/utils';
import { buildDIDSearchUrl, buildRSESearchUrl, buildRuleDetailUrl, detectSearchType, navigateToSearch } from '@/lib/infrastructure/utils/navigation';

type SearchLocation = {
    name: string;
    parameter: string;
    getHref: (query: string) => string;
};

const didLocation: SearchLocation = {
    name: 'DIDs',
    parameter: 'Pattern',
    getHref: (query: string) => {
        return buildDIDSearchUrl({ pattern: query.length > 0 ? query : undefined });
    },
};

const rseLocation: SearchLocation = {
    name: 'RSEs',
    parameter: 'Expression',
    getHref: (query: string) => {
        return buildRSESearchUrl(query.length > 0 ? query : undefined);
    },
};

const ruleLocation: SearchLocation = {
    name: 'Rules',
    parameter: 'ID',
    getHref: (query: string) => {
        return query.length === 0 ? '/rule/list' : buildRuleDetailUrl(query);
    },
};

// Create dynamic DID locations with specific types
const createDIDLocation = (type: string, typeName: string): SearchLocation => ({
    name: 'DIDs',
    parameter: `Search ${typeName}`,
    getHref: (query: string) => {
        return buildDIDSearchUrl({ pattern: query.length > 0 ? query : undefined, type });
    },
});

const LocationLink = (props: { onMouseDown: () => void; isHighlighted: boolean; children: React.ReactNode }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            props.onMouseDown();
        }
    };

    return (
        <div
            className={cn(
                'w-full py-1 px-3 hover:cursor-pointer',
                props.isHighlighted
                    ? 'md:bg-brand-500 md:bg-opacity-25 md:hover:bg-opacity-40 md:text-neutral-900 md:dark:text-neutral-100 md:font-normal text-brand-500 font-bold'
                    : 'md:hover:bg-neutral-200 md:dark:bg-neutral-800 md:hover:dark:bg-neutral-600 hover:text-brand-500 md:hover:text-neutral-900 md:hover:dark:text-neutral-100',
            )}
            onMouseDown={props.onMouseDown}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            {props.children}
        </div>
    );
};

const SearchDropdown = forwardRef(function SearchDropdown(
    props: {
        searchQuery: string;
        searchLocations: SearchLocation[];
        highlightedIndex: number;
        proceedTo: (location: SearchLocation) => void;
    },
    ref: React.ForwardedRef<HTMLDivElement>,
) {
    return (
        <div
            className={cn(
                'md:w-[36rem] w-full flex flex-col md:text-left text-center',
                'md:absolute relative md:mt-2 mt-4',
                'md:rounded-md md:border md:border-neutral-900 md:dark:border-neutral-100 md:border-opacity-10 md:dark:border-opacity-10',
                'md:bg-neutral-100 md:dark:bg-neutral-800',
                'z-[100]',
            )}
        >
            <nav className="w-full h-full flex flex-col items-start">
                {props.searchLocations.map((location, index) => {
                    return (
                        <LocationLink
                            key={location.name}
                            onMouseDown={() => props.proceedTo(location)}
                            isHighlighted={props.highlightedIndex === index}
                        >
                            <span className="flex items-center min-w-0">
                                <span className="flex-shrink-0">{location.parameter}</span> <i className="truncate mx-1">{props.searchQuery}</i>{' '}
                                <span className="flex-shrink-0">in {location.name}</span>
                            </span>
                        </LocationLink>
                    );
                })}
            </nav>
        </div>
    );
});

export const Searchbar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [searchLocations, setSearchLocations] = useState<SearchLocation[]>([didLocation, rseLocation, ruleLocation]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const searchDropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleClickOutside = (event: any) => {
        if (!searchDropdownRef.current?.contains(event.target) && !searchInputRef.current?.contains(event.target)) {
            setIsFocused(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
    }, [searchDropdownRef]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        const searchType = detectSearchType(query);

        if (query.length === 0) {
            setSearchLocations([didLocation, rseLocation, ruleLocation]);
        } else if (searchType === 'did') {
            // DID pattern detected - show all three types
            setSearchLocations([
                createDIDLocation('dataset', 'Dataset'),
                createDIDLocation('file', 'File'),
                createDIDLocation('container', 'Container'),
            ]);
        } else if (searchType === 'rse') {
            // RSE expression detected
            setSearchLocations([rseLocation]);
        } else if (searchType === 'rule') {
            // Rule UUID detected
            setSearchLocations([ruleLocation, rseLocation, didLocation]);
        } else {
            // Generic search
            setSearchLocations([rseLocation, didLocation]);
        }
        setHighlightedIndex(0);
        setSearchQuery(query);
    };

    const proceedTo = (location: SearchLocation) => {
        // Use shared navigation utility (uses window.location.href to avoid caching)
        navigateToSearch(location.getHref(searchQuery));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            setHighlightedIndex(prevIndex => (prevIndex < searchLocations.length - 1 ? prevIndex + 1 : prevIndex));
        } else if (e.key === 'ArrowUp') {
            setHighlightedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            proceedTo(searchLocations[highlightedIndex]);
        }
    };

    return (
        <span className="relative">
            <Input
                placeholder="Search"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                ref={searchInputRef}
                className="h-9"
            />
            {isFocused && (
                <SearchDropdown
                    searchQuery={searchQuery}
                    ref={searchDropdownRef}
                    searchLocations={searchLocations}
                    highlightedIndex={highlightedIndex}
                    proceedTo={proceedTo}
                />
            )}
        </span>
    );
};
