'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { HiExternalLink } from 'react-icons/hi';
import { cn } from '@/component-library/utils';
import { badgeVariants } from '@/component-library/atoms/misc/Badge';
import { AMITagInfo } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';

const DetailRow = ({ label, value }: { label: string; value?: string }) =>
    value ? (
        <div className="flex gap-2">
            <dt className="min-w-[4.5rem] text-neutral-400 dark:text-neutral-600">{label}</dt>
            <dd className="font-mono">{value}</dd>
        </div>
    ) : null;

const AMITagDetails = ({ info }: { info: AMITagInfo }) => {
    if (info.found === false) return <p>Not found in AMI</p>;
    if (info.found === null) return <p>AMI details unavailable</p>;
    return (
        <div className="flex flex-col gap-1.5 max-w-xs">
            <dl className="flex flex-col gap-0.5">
                <DetailRow label="Step" value={info.productionStep} />
                <DetailRow label="Release" value={info.baseRelease} />
                <DetailRow label="Transform" value={info.transformation} />
                <DetailRow label="Created" value={info.created} />
            </dl>
            {info.description && <p className="whitespace-normal">{info.description}</p>}
        </div>
    );
};

/**
 * AMITagPopover renders one AMI tag as a chip that links to AMI (new tab).
 * Hovering or focusing the chip shows the AMI details in a popover. The chip
 * is a Popover.Anchor rather than a Trigger, so a click still just follows
 * the link.
 */
export const AMITagPopover: React.FC<{ info: AMITagInfo }> = ({ info }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Anchor asChild>
                <a
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`AMI tag ${info.tag}, opens AMI in a new tab`}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                    className={cn(
                        badgeVariants({ variant: info.found === false ? 'neutral' : 'info', size: 'sm', shape: 'pill' }),
                        'gap-1 font-mono no-underline hover:underline',
                        'outline-none focus-visible:ring-1 focus-visible:ring-neutral-500',
                    )}
                >
                    {info.tag}
                    <HiExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
            </Popover.Anchor>

            <Popover.Portal>
                <Popover.Content
                    side="top"
                    align="start"
                    sideOffset={6}
                    onOpenAutoFocus={e => e.preventDefault()}
                    onCloseAutoFocus={e => e.preventDefault()}
                    className={cn(
                        'z-50 px-3 py-2 rounded-md text-xs',
                        'bg-neutral-800 text-neutral-100',
                        'dark:bg-neutral-200 dark:text-neutral-900',
                        'shadow-md',
                    )}
                >
                    <AMITagDetails info={info} />
                    <Popover.Arrow className="fill-neutral-800 dark:fill-neutral-200" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

AMITagPopover.displayName = 'AMITagPopover';
