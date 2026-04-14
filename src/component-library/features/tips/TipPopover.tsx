'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/component-library/utils';
import { Tip } from '@/lib/infrastructure/tips/tip-registry';
import { TipCard } from './TipCard';
import { TipBadge, TipBadgeProps } from './TipBadge';

/**
 * TipPopover - A contextual tip that appears in a popover
 * Combines TipBadge trigger with TipCard content in a Radix Popover
 *
 * @example
 * ```tsx
 * <TipPopover tip={tip} onDismiss={() => dismissTip(tip.id)} />
 * <TipPopover tip={tip} side="right" align="start" />
 * ```
 */

export interface TipPopoverProps {
    /** The tip to display */
    tip: Tip;
    /** Callback when the tip is dismissed */
    onDismiss?: () => void;
    /** Whether the tip has been dismissed */
    isDismissed?: boolean;
    /** Side of the trigger to show the popover */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Alignment of the popover relative to the trigger */
    align?: 'start' | 'center' | 'end';
    /** Offset from the trigger in pixels */
    sideOffset?: number;
    /** Props to pass to the TipBadge trigger */
    badgeProps?: Partial<TipBadgeProps>;
    /** Whether the popover is controlled externally */
    open?: boolean;
    /** Callback when open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Additional class name for the trigger wrapper */
    className?: string;
}

export const TipPopover: React.FC<TipPopoverProps> = ({
    tip,
    onDismiss,
    isDismissed = false,
    side = 'top',
    align = 'center',
    sideOffset = 8,
    badgeProps,
    open,
    onOpenChange,
    className,
}) => {
    const [internalOpen, setInternalOpen] = React.useState(false);

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    };

    const handleDismiss = () => {
        handleOpenChange(false);
        onDismiss?.();
    };

    // Don't render if dismissed and we're not showing dismissed tips
    if (isDismissed) {
        return null;
    }

    return (
        <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
            <Popover.Trigger asChild>
                <span className={cn('inline-flex', className)}>
                    <TipBadge tipId={tip.id} variant={isOpen ? 'highlighted' : 'default'} {...badgeProps} />
                </span>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    className={cn(
                        'z-50 w-80 max-w-[calc(100vw-2rem)]',
                        'animate-in fade-in-0 zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        'data-[side=bottom]:slide-in-from-top-2',
                        'data-[side=left]:slide-in-from-right-2',
                        'data-[side=right]:slide-in-from-left-2',
                        'data-[side=top]:slide-in-from-bottom-2',
                        // Shadow
                        'shadow-lg',
                    )}
                >
                    <TipCard tip={tip} onDismiss={handleDismiss} showDismissButton compact />

                    <Popover.Arrow
                        className={cn(
                            'fill-base-info-200 dark:fill-base-info-800',
                            tip.variant === 'success' && 'fill-base-success-200 dark:fill-base-success-800',
                            tip.variant === 'warning' && 'fill-base-warning-200 dark:fill-base-warning-800',
                        )}
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

TipPopover.displayName = 'TipPopover';

/**
 * Controlled TipPopover for programmatic display
 * Useful for auto-showing tips to new users
 */
export interface ControlledTipPopoverProps {
    /** The tip to display */
    tip: Tip | null;
    /** Whether the popover is open */
    open: boolean;
    /** Callback when open state changes */
    onOpenChange: (open: boolean) => void;
    /** Callback when the tip is dismissed */
    onDismiss?: () => void;
    /** Anchor element to position the popover relative to */
    anchorElement?: HTMLElement | null;
}

export const ControlledTipPopover: React.FC<ControlledTipPopoverProps> = ({ tip, open, onOpenChange, onDismiss, anchorElement }) => {
    if (!tip) {
        return null;
    }

    const handleDismiss = () => {
        onOpenChange(false);
        onDismiss?.();
    };

    // If we have an anchor element, we could use virtual positioning
    // For now, render as a floating card in a portal
    if (!open) {
        return null;
    }

    return (
        <Popover.Root open={open} onOpenChange={onOpenChange}>
            {/* Virtual anchor - we use the anchorElement's position if provided */}
            <Popover.Anchor asChild>
                <span
                    className="fixed"
                    style={
                        anchorElement
                            ? {
                                  top: anchorElement.getBoundingClientRect().top,
                                  left: anchorElement.getBoundingClientRect().left,
                                  width: anchorElement.getBoundingClientRect().width,
                                  height: anchorElement.getBoundingClientRect().height,
                              }
                            : {
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                              }
                    }
                />
            </Popover.Anchor>

            <Popover.Portal>
                <Popover.Content
                    side="top"
                    align="center"
                    sideOffset={8}
                    className={cn(
                        'z-50 w-80 max-w-[calc(100vw-2rem)]',
                        'animate-in fade-in-0 zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        'shadow-lg',
                    )}
                >
                    <TipCard tip={tip} onDismiss={handleDismiss} showDismissButton />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

ControlledTipPopover.displayName = 'ControlledTipPopover';
