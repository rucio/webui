import React from 'react';
import { HiOutlineClipboardCopy } from 'react-icons/hi';
import { cn } from '@/component-library/utils';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { copiedToast, errorCopyingToast } from '@/component-library/features/utils/list-toasts';

/**
 * Props for the CopyableCell component
 */
interface CopyableCellProps {
    /**
     * The text to be copied to clipboard when clicked
     */
    text: string;

    /**
     * Content to display in the cell. If not provided, the text prop will be displayed
     */
    children?: React.ReactNode;

    /**
     * Additional CSS classes to apply to the cell container
     */
    className?: string;

    /**
     * Whether to show the copy icon. Defaults to true
     */
    showIcon?: boolean;
}

/**
 * A table cell component that allows copying its content to clipboard on click.
 * Displays a copy icon and shows a toast notification when content is copied.
 *
 * @example
 * ```tsx
 * <CopyableCell text="scope:dataset_name">
 *   scope:dataset_name
 * </CopyableCell>
 * ```
 */
export const CopyableCell = ({ text, children, className, showIcon = true }: CopyableCellProps) => {
    const { toast } = useToast();

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast(copiedToast);
            })
            .catch(() => {
                toast(errorCopyingToast);
            });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCopy(e as unknown as React.MouseEvent);
        }
    };

    return (
        <div
            className={cn('flex items-center gap-1 cursor-pointer', className)}
            onClick={handleCopy}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            {showIcon && (
                <HiOutlineClipboardCopy className="flex-shrink-0 h-4 w-4 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200" />
            )}
            {children || <span>{text}</span>}
        </div>
    );
};

/**
 * Props for the CopyableLinkCell component
 */
interface CopyableLinkCellProps extends CopyableCellProps {
    /**
     * The URL to navigate to when the link is clicked
     */
    href: string;
}

/**
 * A table cell component that combines copy-to-clipboard functionality with a clickable link.
 * The copy icon copies the text to clipboard, while clicking the content navigates to the href.
 *
 * @example
 * ```tsx
 * <CopyableLinkCell
 *   text="scope:dataset_name"
 *   href="/did/page/scope/dataset_name"
 * >
 *   scope:dataset_name
 * </CopyableLinkCell>
 * ```
 */
export const CopyableLinkCell = ({ text, href, children, className, showIcon = true }: CopyableLinkCellProps) => {
    const { toast } = useToast();

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast(copiedToast);
            })
            .catch(() => {
                toast(errorCopyingToast);
            });
    };

    const handleLink = (e: React.MouseEvent) => {
        // Only navigate if clicking on the text, not the icon
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName !== 'svg') {
            window.open(href, '_blank', 'noopener,noreferrer');
        }
    };

    const handleCopyKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            const syntheticEvent = e as unknown as React.MouseEvent;
            handleCopy(syntheticEvent);
        }
    };

    const handleLinkKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className={cn('flex items-center gap-1', className)}>
            {showIcon && (
                <HiOutlineClipboardCopy
                    className="flex-shrink-0 h-4 w-4 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                    onClick={handleCopy}
                    onKeyDown={handleCopyKeyDown}
                    role="button"
                    tabIndex={0}
                    title="Copy to clipboard"
                />
            )}
            <div
                className="cursor-pointer hover:underline"
                onClick={handleLink}
                onKeyDown={handleLinkKeyDown}
                role="button"
                tabIndex={0}
            >
                {children || <span>{text}</span>}
            </div>
        </div>
    );
};