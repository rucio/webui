'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/component-library/utils';
import { formatDate, formatDateTime } from '@/component-library/features/utils/text-formatters';

export interface DateWithTooltipProps {
    /** ISO date string or Date object to display */
    date: Date | string | undefined | null;
    /** Additional class name for the trigger span */
    className?: string;
}

/**
 * DateWithTooltip — renders a short YYYY/MM/DD date with a hover/focus tooltip
 * showing the full datetime (YYYY/MM/DD HH:MM:SS UTC).
 *
 * Uses the existing @radix-ui/react-popover primitive (same as TipPopover) with
 * controlled open state driven by mouse-enter/leave and focus/blur events so that
 * the tooltip is accessible via both mouse hover and keyboard focus.
 *
 * A delayed-close strategy (80 ms grace period) keeps the popover open while the
 * pointer travels from the trigger button into the popover content, preventing the
 * flicker that would otherwise occur because the trigger's onMouseLeave fires before
 * the content's onMouseEnter.
 */
export const DateWithTooltip: React.FC<DateWithTooltipProps> = ({ date, className }) => {
    const [open, setOpen] = React.useState(false);
    const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cancel any pending close and open immediately.
    const openPopover = React.useCallback(() => {
        if (closeTimeoutRef.current !== null) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setOpen(true);
    }, []);

    // Schedule a close after a short grace period so the pointer can move into the content.
    const scheduleClose = React.useCallback(() => {
        closeTimeoutRef.current = setTimeout(() => {
            setOpen(false);
            closeTimeoutRef.current = null;
        }, 80);
    }, []);

    // Clean up on unmount.
    React.useEffect(() => {
        return () => {
            if (closeTimeoutRef.current !== null) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const shortDate = date != null ? formatDate(date instanceof Date ? date.toISOString() : date) : 'N/A';
    const fullDateTime = formatDateTime(date);

    // Don't show tooltip when there is no meaningful date
    const hasDate = date != null && shortDate !== 'N/A';

    if (!hasDate) {
        return <span className={cn('text-neutral-400 dark:text-neutral-500', className)}>{shortDate}</span>;
    }

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                {/* Use a button so the element is interactive — required for tabIndex + a11y */}
                <button
                    type="button"
                    className={cn(
                        'inline-block cursor-default bg-transparent border-0 p-0 m-0',
                        'font-[inherit] text-[inherit]',
                        'underline decoration-dotted underline-offset-2',
                        'outline-none focus-visible:ring-1 focus-visible:ring-neutral-500',
                        className,
                    )}
                    onMouseEnter={openPopover}
                    onMouseLeave={scheduleClose}
                    onFocus={openPopover}
                    onBlur={() => setOpen(false)}
                    aria-label={fullDateTime}
                >
                    {shortDate}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    side="top"
                    align="center"
                    sideOffset={6}
                    // Prevent the popover from stealing focus (which would close it immediately)
                    onOpenAutoFocus={e => e.preventDefault()}
                    // Keep the popover open while the pointer is over its content
                    onMouseEnter={openPopover}
                    onMouseLeave={scheduleClose}
                    className={cn(
                        'z-50 px-3 py-1.5 rounded-md text-xs font-mono',
                        'bg-neutral-800 text-neutral-100',
                        'dark:bg-neutral-200 dark:text-neutral-900',
                        'shadow-md',
                        'animate-in fade-in-0 zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        'data-[side=bottom]:slide-in-from-top-2',
                        'data-[side=top]:slide-in-from-bottom-2',
                    )}
                >
                    {fullDateTime}
                    <Popover.Arrow className="fill-neutral-800 dark:fill-neutral-200" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

DateWithTooltip.displayName = 'DateWithTooltip';

/**
 * DateCellRenderer — AG Grid cell renderer that wraps DateWithTooltip.
 * Usage in column def: `cellRenderer: DateCellRenderer`
 */
export const DateCellRenderer = (props: { value: string | Date | undefined | null }) => {
    return <DateWithTooltip date={props.value} />;
};

DateCellRenderer.displayName = 'DateCellRenderer';
