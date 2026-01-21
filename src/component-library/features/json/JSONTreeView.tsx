'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HiChevronRight, HiChevronDown, HiClipboard, HiClipboardCheck } from 'react-icons/hi';
import { toast } from '@/lib/infrastructure/hooks/useToast';
import { twMerge } from 'tailwind-merge';

export type JSONTreeViewProps = {
    value: string;
    expandDepth?: number;
    showCopyButton?: boolean;
    maxHeight?: string;
    className?: string;
};

type JSONNodeProps = {
    data: any;
    keyName?: string;
    level: number;
    expandDepth: number;
    isLast?: boolean;
};

/**
 * Recursive component that renders a JSON node (object, array, or primitive value).
 * Handles expand/collapse state and styling for different value types.
 */
const JSONNode: React.FC<JSONNodeProps> = ({ data, keyName, level, expandDepth, isLast = false }) => {
    const [isExpanded, setIsExpanded] = useState(level < expandDepth);

    const toggleExpand = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    // Render primitive values (string, number, boolean, null)
    const renderPrimitive = (value: any) => {
        if (value === null) {
            return <span className="text-blue-600 dark:text-blue-400">null</span>;
        }

        switch (typeof value) {
            case 'string':
                return <span className="text-green-700 dark:text-green-400">&quot;{value}&quot;</span>;
            case 'number':
                return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
            case 'boolean':
                return <span className="text-purple-600 dark:text-purple-400">{value.toString()}</span>;
            default:
                return <span className="text-neutral-600 dark:text-neutral-400">{String(value)}</span>;
        }
    };

    // Handle objects
    if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
        const keys = Object.keys(data);
        const isEmpty = keys.length === 0;

        return (
            <div>
                <div className="flex items-start group">
                    {/* Key name */}
                    {keyName !== undefined && (
                        <>
                            <button
                                type="button"
                                onClick={toggleExpand}
                                className="flex items-center hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded px-0.5 -ml-0.5 transition-colors"
                                aria-label={isExpanded ? 'Collapse object' : 'Expand object'}
                                aria-expanded={isExpanded}
                            >
                                {isEmpty ? (
                                    <span className="w-4 h-4" />
                                ) : isExpanded ? (
                                    <HiChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                ) : (
                                    <HiChevronRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                )}
                                <span className="text-red-600 dark:text-red-400 font-medium">{keyName}</span>
                            </button>
                            <span className="text-neutral-900 dark:text-neutral-100">:&nbsp;</span>
                        </>
                    )}

                    {/* Opening brace and summary */}
                    {isEmpty ? (
                        <span className="text-neutral-900 dark:text-neutral-100">{'{}'}</span>
                    ) : !isExpanded ? (
                        <button
                            type="button"
                            onClick={toggleExpand}
                            className="text-neutral-500 dark:text-neutral-400 italic hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                        >
                            {'{'} {keys.length} {keys.length === 1 ? 'property' : 'properties'} {'}'}
                        </button>
                    ) : (
                        <span className="text-neutral-900 dark:text-neutral-100">{'{'}</span>
                    )}
                </div>

                {/* Children */}
                {isExpanded && !isEmpty && (
                    <div className="pl-4 border-l border-neutral-200 dark:border-neutral-700 ml-2">
                        {keys.map((key, index) => (
                            <JSONNode key={key} data={data[key]} keyName={key} level={level + 1} expandDepth={expandDepth} isLast={index === keys.length - 1} />
                        ))}
                    </div>
                )}

                {/* Closing brace */}
                {isExpanded && !isEmpty && <div className="text-neutral-900 dark:text-neutral-100">{'}'}{!isLast && ','}</div>}
            </div>
        );
    }

    // Handle arrays
    if (Array.isArray(data)) {
        const isEmpty = data.length === 0;

        return (
            <div>
                <div className="flex items-start group">
                    {/* Key name */}
                    {keyName !== undefined && (
                        <>
                            <button
                                type="button"
                                onClick={toggleExpand}
                                className="flex items-center hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded px-0.5 -ml-0.5 transition-colors"
                                aria-label={isExpanded ? 'Collapse array' : 'Expand array'}
                                aria-expanded={isExpanded}
                            >
                                {isEmpty ? (
                                    <span className="w-4 h-4" />
                                ) : isExpanded ? (
                                    <HiChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                ) : (
                                    <HiChevronRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                )}
                                <span className="text-red-600 dark:text-red-400 font-medium">{keyName}</span>
                            </button>
                            <span className="text-neutral-900 dark:text-neutral-100">:&nbsp;</span>
                        </>
                    )}

                    {/* Opening bracket and summary */}
                    {isEmpty ? (
                        <span className="text-neutral-900 dark:text-neutral-100">[]</span>
                    ) : !isExpanded ? (
                        <button
                            type="button"
                            onClick={toggleExpand}
                            className="text-neutral-500 dark:text-neutral-400 italic hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                        >
                            {'['} {data.length} {data.length === 1 ? 'item' : 'items'} {']'}
                        </button>
                    ) : (
                        <span className="text-neutral-900 dark:text-neutral-100">[</span>
                    )}
                </div>

                {/* Children */}
                {isExpanded && !isEmpty && (
                    <div className="pl-4 border-l border-neutral-200 dark:border-neutral-700 ml-2">
                        {data.map((item, index) => (
                            <JSONNode key={index} data={item} level={level + 1} expandDepth={expandDepth} isLast={index === data.length - 1} />
                        ))}
                    </div>
                )}

                {/* Closing bracket */}
                {isExpanded && !isEmpty && <div className="text-neutral-900 dark:text-neutral-100">{']'}{!isLast && ','}</div>}
            </div>
        );
    }

    // Handle primitives
    return (
        <div className="flex items-start">
            {keyName !== undefined && (
                <>
                    <span className="text-red-600 dark:text-red-400 font-medium">{keyName}</span>
                    <span className="text-neutral-900 dark:text-neutral-100">:&nbsp;</span>
                </>
            )}
            {renderPrimitive(data)}
            {!isLast && <span className="text-neutral-900 dark:text-neutral-100">,</span>}
        </div>
    );
};

/**
 * JSONTreeView component for displaying JSON with interactive expand/collapse tree structure.
 *
 * Features:
 * - Interactive expand/collapse for nested objects and arrays
 * - Syntax highlighting with dark mode support
 * - Copy to clipboard functionality
 * - Keyboard navigation (click to expand/collapse)
 * - Design system compliant styling
 * - Fully custom implementation with no external dependencies
 *
 * @example
 * ```tsx
 * <JSONTreeView
 *   value={jsonString}
 *   expandDepth={2}
 *   showCopyButton
 *   maxHeight="400px"
 * />
 * ```
 */
export const JSONTreeView: React.FC<JSONTreeViewProps> = ({
    value,
    expandDepth = 2,
    showCopyButton = true,
    maxHeight = '600px',
    className,
}) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isValidJSON, setIsValidJSON] = useState<boolean>(true);
    const [parsedValue, setParsedValue] = useState<any>(null);

    // Parse JSON on mount or when value changes
    useEffect(() => {
        try {
            const parsed = JSON.parse(value);
            setParsedValue(parsed);
            setIsValidJSON(true);
        } catch {
            setParsedValue(null);
            setIsValidJSON(false);
        }
    }, [value]);

    // Copy to clipboard handler
    const handleCopy = async () => {
        try {
            const formatted = JSON.stringify(parsedValue, null, 2);
            await navigator.clipboard.writeText(formatted);
            setIsCopied(true);
            toast({
                title: 'Copied to clipboard',
                description: 'JSON content has been copied successfully',
                variant: 'success',
            });
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            toast({
                title: 'Copy failed',
                description: 'Failed to copy JSON content to clipboard',
                variant: 'error',
            });
        }
    };

    const containerClasses = twMerge(
        'relative rounded border',
        'bg-neutral-100 dark:bg-neutral-800',
        'border-neutral-200 dark:border-neutral-700',
        className,
    );

    const headerClasses =
        'flex items-center justify-between gap-2 px-3 py-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900';

    const buttonBaseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded transition-colors';

    const copyButtonClasses = twMerge(
        buttonBaseClasses,
        isCopied
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600',
    );

    const treeWrapperClasses = 'overflow-auto p-3 font-mono text-sm leading-relaxed';

    const warningBadgeClasses =
        'inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700';

    if (!isValidJSON) {
        return (
            <div className={containerClasses}>
                <div className={headerClasses}>
                    <span className={warningBadgeClasses}>Invalid JSON - cannot display tree view</span>
                </div>
                <div className="p-3 text-sm font-mono text-neutral-900 dark:text-neutral-100">
                    <pre className="whitespace-pre-wrap break-words m-0">{value}</pre>
                </div>
            </div>
        );
    }

    return (
        <div className={containerClasses}>
            {/* Header with controls */}
            {showCopyButton && (
                <div className={headerClasses}>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Interactive Tree View</div>
                    <button type="button" onClick={handleCopy} className={copyButtonClasses} aria-label="Copy to clipboard">
                        {isCopied ? (
                            <>
                                <HiClipboardCheck className="w-4 h-4" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <HiClipboard className="w-4 h-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* JSON tree content */}
            <div className={treeWrapperClasses} style={{ maxHeight }}>
                <JSONNode data={parsedValue} level={0} expandDepth={expandDepth} isLast />
            </div>
        </div>
    );
};
