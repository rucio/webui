import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { Input } from '@/component-library/atoms/form/input';

type SearchLocation = {
    name: string;
    parameter: string;
    getHref: (query: string) => string;
};

const didLocation: SearchLocation = {
    name: 'DIDs',
    parameter: 'Pattern',
    getHref: (query: string) => {
        return query.length === 0 ? '/did/list' : `/did/list?pattern=${query}`;
    },
};

const rseLocation: SearchLocation = {
    name: 'RSEs',
    parameter: 'Expression',
    getHref: (query: string) => {
        return query.length === 0 ? '/rse/list' : `/rse/list?expression=${query}`;
    },
};

const ruleLocation: SearchLocation = {
    name: 'Rules',
    parameter: 'ID',
    getHref: (query: string) => {
        return query.length === 0 ? '/rule/list' : `/rule/page/${query}`;
    },
};

const LocationLink = (props: { onMouseDown: () => void; isHighlighted: boolean; children: React.ReactNode }) => {
    return (
        <div
            className={twMerge(
                'w-full py-1 px-3 hover:cursor-pointer',
                props.isHighlighted
                    ? 'bg-brand-500 bg-opacity-25 hover:bg-opacity-40'
                    : 'hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-600',
            )}
            onMouseDown={props.onMouseDown}
        >
            {props.children}
        </div>
    );
};

const SearchDropdown = forwardRef(function SearchDropdown(
    props: {
        isInputFocused: boolean;
        searchQuery: string;
        searchLocations: SearchLocation[];
        highlightedIndex: number;
        proceedTo: (location: SearchLocation) => void;
    },
    ref: React.ForwardedRef<HTMLDivElement>,
) {
    const { isInputFocused, searchQuery } = props;

    return (
        <div
            className={twMerge(
                'w-[40rem] flex flex-col',
                isInputFocused ? 'visible' : 'invisible',
                'absolute mt-2',
                'rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                'bg-neutral-100 dark:bg-neutral-800',
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
                            <span>
                                {location.parameter} <i>{searchQuery}</i> in {location.name}
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
        if (query.length === 0) {
            setSearchLocations([didLocation, rseLocation, ruleLocation]);
        } else if (query.includes(':')) {
            // Certainly a DID pattern
            setSearchLocations([didLocation]);
        } else {
            if (/[=|&\\]/.test(query)) {
                // Certainly an RSE expression
                setSearchLocations([rseLocation]);
            } else if (query.length === 32 && /^[a-zA-Z0-9]+$/.test(query)) {
                // Certainly a Rule UUID
                setSearchLocations([ruleLocation, rseLocation, didLocation]);
            } else {
                // Anything but a UUID
                setSearchLocations([rseLocation, didLocation]);
            }
        }
        setHighlightedIndex(0);
        setSearchQuery(query);
    };

    const proceedTo = (location: SearchLocation) => {
        // Not using Next.js routing because of caching
        window.location.href = location.getHref(searchQuery);
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
            <SearchDropdown
                isInputFocused={isFocused}
                searchQuery={searchQuery}
                ref={searchDropdownRef}
                searchLocations={searchLocations}
                highlightedIndex={highlightedIndex}
                proceedTo={proceedTo}
            />
        </span>
    );
};
