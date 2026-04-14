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
 * DateWithTooltip — renders a short YYYY/MM/DD date that reveals the full
 * datetime (YYYY/MM/DD HH:MM:SS UTC) in a popover on click.
 *
 * Uses @radix-ui/react-popover (same primitive as TipPopover) portaled to the
 * body so the popover escapes AG Grid's overflow:hidden cells. Clicking the
 * date toggles the popover; clicking outside or pressing Escape closes it.
 */
export const DateWithTooltip: React.FC<DateWithTooltipProps> = ({ date, className }) => {
    const shortDate = date != null ? formatDate(date instanceof Date ? date.toISOString() : date) : 'N/A';
    const fullDateTime = formatDateTime(date);

    const hasDate = date != null && shortDate !== 'N/A';

    if (!hasDate) {
        return <span className={cn('text-neutral-400 dark:text-neutral-500', className)}>{shortDate}</span>;
    }

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className={cn(
                        'inline-block cursor-pointer bg-transparent border-0 p-0 m-0',
                        'font-[inherit] text-[inherit]',
                        'underline decoration-dotted underline-offset-2',
                        'outline-none focus-visible:ring-1 focus-visible:ring-neutral-500',
                        className,
                    )}
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
                    onOpenAutoFocus={e => e.preventDefault()}
                    className={cn(
                        'z-50 px-3 py-1.5 rounded-md text-xs font-mono',
                        'bg-neutral-800 text-neutral-100',
                        'dark:bg-neutral-200 dark:text-neutral-900',
                        'shadow-md',
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
