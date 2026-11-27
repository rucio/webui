'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { HiExternalLink } from 'react-icons/hi';
import { cn } from '@/component-library/utils';
import { badgeVariants } from '@/component-library/atoms/misc/Badge';
import { AMITagInfo } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';
import { popoverArrowFill, popoverVariants, PopoverRow } from '@/component-library/atoms/popover/PopoverUtils';

const AMITagDetails = ({ info }: { info: AMITagInfo }) => {
    if (info.found === false) return <p>Not found in AMI</p>;
    if (info.found === null) return <p>AMI details unavailable</p>;
    return (
        <div className="flex flex-col gap-1.5">
            <dl className="flex flex-col gap-0.5">
                <PopoverRow label="Step" value={info.productionStep} variant="neutral" />
                <PopoverRow label="Release" value={info.baseRelease} variant="success" />
                <PopoverRow label="Transform" value={info.transformation} variant="error" />
                <PopoverRow label="Created" value={info.created} variant="warning" />
            </dl>
            {info.description && <p className="whitespace-normal">{info.description}</p>}
        </div>
    );
};

/** Grace period so the pointer can travel from the chip onto the popover. */
const CLOSE_DELAY_MS = 150;

/**
 * AMITagPopover renders one AMI tag as a chip that links to AMI (new tab).
 * Hovering or focusing the chip shows the AMI details in a popover. The chip
 * is a Popover.Anchor rather than a Trigger, so a click still just follows
 * the link.
 */
export const AMITagPopover: React.FC<{ info: AMITagInfo }> = ({ info }) => {
    const [open, setOpen] = React.useState(false);
    const contentId = React.useId();
    const closeTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const show = () => {
        clearTimeout(closeTimer.current);
        setOpen(true);
    };
    const hideSoon = () => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
    };
    React.useEffect(() => () => clearTimeout(closeTimer.current), []);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Anchor asChild>
                <a
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`AMI tag ${info.tag}, opens AMI in a new tab`}
                    aria-describedby={open ? contentId : undefined}
                    onMouseEnter={show}
                    onMouseLeave={hideSoon}
                    onFocus={show}
                    onBlur={hideSoon}
                    className={cn(
                        badgeVariants({ variant: info.found === false ? 'neutral' : 'info', size: 'sm', shape: 'pill' }),
                        'gap-1 font-mono no-underline hover:underline',
                        'outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-500',
                    )}
                >
                    {info.tag}
                    <HiExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
            </Popover.Anchor>

            <Popover.Portal>
                <Popover.Content
                    id={contentId}
                    onMouseEnter={show}
                    onMouseLeave={hideSoon}
                    side="top"
                    align="start"
                    sideOffset={6}
                    onOpenAutoFocus={e => e.preventDefault()}
                    onCloseAutoFocus={e => e.preventDefault()}
                    className={cn('text-xs max-w-xs', popoverVariants({ variant: 'neutral' }))}
                >
                    <AMITagDetails info={info} />
                    <Popover.Arrow className={popoverArrowFill['neutral']} />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

AMITagPopover.displayName = 'AMITagPopover';
