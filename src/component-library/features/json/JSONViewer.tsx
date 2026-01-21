'use client';

import React, { useState, useEffect } from 'react';
import Highlight from 'react-highlight';
import 'react-highlight/node_modules/highlight.js/styles/github.css';
import { HiClipboard, HiClipboardCheck, HiArrowsPointingOut } from 'react-icons/hi2';
import { XMarkIcon } from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from '@/lib/infrastructure/hooks/useToast';
import { twMerge } from 'tailwind-merge';
import { JSONTreeView } from './JSONTreeView';
import { useJSONComplexity, type JSONViewerMode } from './useJSONComplexity';

export type JSONViewerProps = {
    value: string;
    mode?: JSONViewerMode;
    expandDepth?: number;
    defaultExpanded?: boolean;
    showLineNumbers?: boolean;
    showCopyButton?: boolean;
    showRawToggle?: boolean;
    showExpandButton?: boolean;
    expandTitle?: string;
    maxHeight?: string;
    className?: string;
};

/**
 * JSONViewer component with dual display modes for JSON data.
 *
 * Features:
 * - **Dual modes**: Static (syntax highlighting) and Interactive (expandable tree)
 * - **Auto-detection**: Automatically chooses best mode based on JSON complexity
 * - Syntax highlighting with dark mode support
 * - Interactive expand/collapse for nested structures (interactive mode)
 * - Copy to clipboard functionality
 * - Toggle between raw and formatted views (static mode)
 * - Error handling for invalid JSON
 * - Design system compliant styling
 *
 * Mode selection:
 * - `mode="auto"` (default): Automatically detects complexity
 *   - Uses interactive for: arrays with 2+ items, depth > 2 levels, or 10+ total keys
 *   - Uses static for: simple flat objects and small structures
 * - `mode="static"`: Always use syntax highlighting (best for simple JSON)
 * - `mode="interactive"`: Always use expandable tree (best for complex nested JSON)
 *
 * @example
 * ```tsx
 * // Auto-detect mode (recommended)
 * <JSONViewer value={jsonString} />
 *
 * // Explicit static mode
 * <JSONViewer value={jsonString} mode="static" showRawToggle />
 *
 * // Explicit interactive mode
 * <JSONViewer value={jsonString} mode="interactive" expandDepth={2} />
 * ```
 */
export const JSONViewer: React.FC<JSONViewerProps> = ({
    value,
    mode = 'auto',
    expandDepth = 2,
    showLineNumbers = false,
    showCopyButton = true,
    showRawToggle = true,
    showExpandButton = false,
    expandTitle = 'JSON Viewer',
    maxHeight = '600px',
    className,
}) => {
    const resolvedMode = useJSONComplexity(value, mode);
    const [dark, setDark] = useState<boolean>(false);
    const [isFormatted, setIsFormatted] = useState<boolean>(true);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isValidJSON, setIsValidJSON] = useState<boolean>(true);
    const [formattedValue, setFormattedValue] = useState<string>('');
    const [displayValue, setDisplayValue] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Detect dark mode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setDark(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setDark(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Parse and format JSON on mount or when value changes
    useEffect(() => {
        try {
            const parsed = JSON.parse(value);
            const formatted = JSON.stringify(parsed, null, 2);
            setFormattedValue(formatted);
            setDisplayValue(formatted);
            setIsValidJSON(true);
        } catch {
            setFormattedValue(value);
            setDisplayValue(value);
            setIsValidJSON(false);
        }
    }, [value]);

    // Update display value when toggle changes
    useEffect(() => {
        if (isValidJSON) {
            setDisplayValue(isFormatted ? formattedValue : value);
        }
    }, [isFormatted, isValidJSON, formattedValue, value]);

    // Copy to clipboard handler
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayValue);
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

    // Toggle between raw and formatted
    const handleToggleFormat = () => {
        setIsFormatted(!isFormatted);
    };

    // GitHub theme styles for syntax highlighting
    const styles = () => {
        const base = 'pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}';
        const lightTheme =
            '.hljs{color:#24292e;background:transparent}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#d73a49}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#6f42c1}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable{color:#005cc5}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#032f62}.hljs-built_in,.hljs-symbol{color:#e36209}.hljs-code,.hljs-comment,.hljs-formula{color:#6a737d}.hljs-name,.hljs-quote,.hljs-selector-pseudo,.hljs-selector-tag{color:#22863a}.hljs-subst{color:#24292e}.hljs-section{color:#005cc5;font-weight:700}.hljs-bullet{color:#735c0f}.hljs-emphasis{color:#24292e;font-style:italic}.hljs-strong{color:#24292e;font-weight:700}.hljs-addition{color:#22863a;background-color:#f0fff4}.hljs-deletion{color:#b31d28;background-color:#ffeef0}';
        const darkTheme =
            '.hljs{color:#adbac7;background:transparent}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#f47067}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#dcbdfb}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable{color:#6cb6ff}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#96d0ff}.hljs-built_in,.hljs-symbol{color:#f69d50}.hljs-code,.hljs-comment,.hljs-formula{color:#768390}.hljs-name,.hljs-quote,.hljs-selector-pseudo,.hljs-selector-tag{color:#8ddb8c}.hljs-subst{color:#adbac7}.hljs-section{color:#316dca;font-weight:700}.hljs-bullet{color:#eac55f}.hljs-emphasis{color:#adbac7;font-style:italic}.hljs-strong{color:#adbac7;font-weight:700}.hljs-addition{color:#b4f1b4;background-color:#1b4721}.hljs-deletion{color:#ffd8d3;background-color:#78191b}';

        return base + (dark ? darkTheme : lightTheme);
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

    const toggleButtonClasses = twMerge(
        buttonBaseClasses,
        'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600',
    );

    const expandButtonClasses = twMerge(
        buttonBaseClasses,
        'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600',
    );

    const codeWrapperClasses = twMerge('overflow-auto p-3 text-sm font-mono leading-relaxed', showLineNumbers && 'counter-reset-line');

    const warningBadgeClasses =
        'inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700';

    // Render interactive tree view for complex JSON
    if (resolvedMode === 'interactive') {
        return (
            <>
                <JSONTreeView
                    value={value}
                    expandDepth={expandDepth}
                    showCopyButton={showCopyButton}
                    showExpandButton={showExpandButton}
                    onExpand={() => setIsModalOpen(true)}
                    maxHeight={maxHeight}
                    className={className}
                />

                {/* Modal for expanded view */}
                {showExpandButton && (
                    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-50" />
                            <Dialog.Content
                                className="
                                    fixed inset-4 md:inset-8
                                    bg-neutral-0 dark:bg-neutral-900
                                    border border-neutral-200 dark:border-neutral-700
                                    rounded-lg
                                    shadow-lg
                                    z-50
                                    focus:outline-none
                                    flex flex-col
                                "
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                                    <Dialog.Title className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                                        {expandTitle}
                                    </Dialog.Title>
                                    <Dialog.Close asChild>
                                        <button
                                            className="
                                                p-1.5
                                                rounded
                                                hover:bg-neutral-100 dark:hover:bg-neutral-800
                                                focus:outline-none focus:ring-2 focus:ring-brand-500
                                                transition-colors duration-150
                                            "
                                            aria-label="Close"
                                        >
                                            <XMarkIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                                        </button>
                                    </Dialog.Close>
                                </div>

                                {/* Modal Content */}
                                <div className="flex-1 overflow-hidden p-6">
                                    <JSONTreeView
                                        value={value}
                                        expandDepth={expandDepth}
                                        showCopyButton={true}
                                        maxHeight="100%"
                                        className="h-full"
                                    />
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                )}
            </>
        );
    }

    // Render static view with syntax highlighting for simple JSON
    return (
        <>
            <style>{styles()}</style>
            <div className={containerClasses}>
                {/* Header with controls */}
                {(showCopyButton || showRawToggle || showExpandButton || !isValidJSON) && (
                    <div className={headerClasses}>
                        <div className="flex items-center gap-2">
                            {!isValidJSON && <span className={warningBadgeClasses}>Invalid JSON - displaying raw value</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            {showExpandButton && (
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className={expandButtonClasses}
                                    aria-label="Expand to full screen"
                                >
                                    <HiArrowsPointingOut className="w-4 h-4" />
                                    <span>Expand</span>
                                </button>
                            )}
                            {showRawToggle && isValidJSON && (
                                <button
                                    type="button"
                                    onClick={handleToggleFormat}
                                    className={toggleButtonClasses}
                                    aria-label={isFormatted ? 'Show raw JSON' : 'Show formatted JSON'}
                                >
                                    {isFormatted ? 'Raw' : 'Formatted'}
                                </button>
                            )}
                            {showCopyButton && (
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
                            )}
                        </div>
                    </div>
                )}

                {/* JSON content */}
                <div className={codeWrapperClasses} style={{ maxHeight }}>
                    {isValidJSON && isFormatted ? (
                        <Highlight className="language-json">{displayValue}</Highlight>
                    ) : (
                        <pre className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap break-words m-0">{displayValue}</pre>
                    )}
                </div>
            </div>

            {/* Modal for expanded view (static mode) */}
            {showExpandButton && (
                <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-50" />
                        <Dialog.Content
                            className="
                                fixed inset-4 md:inset-8
                                bg-neutral-0 dark:bg-neutral-900
                                border border-neutral-200 dark:border-neutral-700
                                rounded-lg
                                shadow-lg
                                z-50
                                focus:outline-none
                                flex flex-col
                            "
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                                <Dialog.Title className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                                    {expandTitle}
                                </Dialog.Title>
                                <Dialog.Close asChild>
                                    <button
                                        className="
                                            p-1.5
                                            rounded
                                            hover:bg-neutral-100 dark:hover:bg-neutral-800
                                            focus:outline-none focus:ring-2 focus:ring-brand-500
                                            transition-colors duration-150
                                        "
                                        aria-label="Close"
                                    >
                                        <XMarkIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                                    </button>
                                </Dialog.Close>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-auto p-6">
                                <style>{styles()}</style>
                                <div className="font-mono text-sm leading-relaxed">
                                    {isValidJSON && isFormatted ? (
                                        <Highlight className="language-json">{displayValue}</Highlight>
                                    ) : (
                                        <pre className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap break-words m-0">{displayValue}</pre>
                                    )}
                                </div>
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            )}
        </>
    );
};
