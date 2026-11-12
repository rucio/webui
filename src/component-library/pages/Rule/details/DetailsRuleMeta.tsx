import React from 'react';
import { Divider } from '@/component-library/atoms/misc/Divider';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { Field } from '@/component-library/atoms/misc/Field';
import { DateWithTooltip } from '@/component-library/features/utils/DateWithTooltip';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { RuleMetaViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import { RuleStateBadge } from '@/component-library/features/badges/Rule/RuleStateBadge';
import { RuleGroupingBadge } from '@/component-library/features/badges/Rule/RuleGroupingBadge';
import { RuleNotificationBadge } from '@/component-library/features/badges/Rule/RuleNotificationBadge';
import { CopyableLinkCell } from '@/component-library/features/table/cells/CopyableCell';
import { RuleState } from '@/lib/core/entity/rucio';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/component-library/utils';
import { popoverVariants, PopoverRow, popoverArrowFill } from '@/component-library/atoms/popover/PopoverUtils';

/**
 * A responsive divider component for rule sections.
 *
 * Renders a full-width divider that is only visible on screens smaller than the 'lg' breakpoint.
 * Useful for visually separating sections in mobile and tablet layouts.
 *
 * @returns {React.ReactElement} The divider element.
 */
const RuleSectionDivider = () => (
    <div className="w-full lg:hidden my-4">
        <Divider />
    </div>
);

export const DetailsRuleMeta = ({ meta }: { meta: RuleMetaViewModel }) => {
    return (
        <KeyValueWrapper className="w-full p-6 flex flex-col gap-6">
            <div className="w-full flex flex-col lg:flex-row lg:gap-8">
                <div className="flex flex-col flex-1 min-w-0">
                    <KeyValueRow name="State">
                        {meta.state === RuleState.STUCK ?
                            <Popover.Root>
                                <Popover.Trigger asChild>
                                    <button
                                        type="button"
                                    >
                                        <RuleStateBadge value={meta.state} />
                                    </button>
                                </Popover.Trigger>

                                <Popover.Portal>
                                    <Popover.Content
                                        side="top"
                                        align="center"
                                        className={cn('text-xs max-w-[500px]', popoverVariants({ variant: 'error' }))}
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <PopoverRow label="Stuck at" value={meta.stuck_at ?? 'None'} variant="error" />
                                            <PopoverRow label="Error" value={meta.error ?? 'None'} variant="error" breakValue="break-all" />
                                        </div>
                                        <Popover.Arrow className={popoverArrowFill['error']} />
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
                            :
                            <RuleStateBadge value={meta.state} />
                        }
                    </KeyValueRow>
                    <KeyValueRow name="DID">
                        <div className="flex flex-row gap-2 items-center max-w-[20rem]">
                            <CopyableLinkCell
                                text={`${meta.scope}:${meta.name}`}
                                href={`/did/${encodeURIComponent(meta.scope)}/${encodeURIComponent(meta.name)}`}
                            >
                                <Field>
                                    {meta.scope}:{meta.name}
                                </Field>
                            </CopyableLinkCell>
                        </div>
                    </KeyValueRow>
                    <KeyValueRow name="DID Type">
                        <DIDTypeBadge value={meta.did_type} className="w-full" />
                    </KeyValueRow>
                    <KeyValueRow name="RSE Expression">
                        <div className="max-w-[20rem]">
                            <CopyableLinkCell
                                text={meta.rse_expression}
                                href={`/rses?expression=${encodeURIComponent(meta.rse_expression)}&autoSearch=true`}
                            >
                                <Field>{meta.rse_expression}</Field>
                            </CopyableLinkCell>
                        </div>
                    </KeyValueRow>
                    <KeyValueRow name="Account">
                        <Field>{meta.account}</Field>
                    </KeyValueRow>
                </div>
                <RuleSectionDivider />
                <div className="flex flex-col flex-1 min-w-0">
                    <KeyValueRow name="Locks OK">
                        <Field>{meta.locks_ok_cnt}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Locks Replicating">
                        <Field>{meta.locks_replicating_cnt}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Locks Stuck">
                        <Field>{meta.locks_stuck_cnt}</Field>
                    </KeyValueRow>
                </div>
                <RuleSectionDivider />
                <div className="flex flex-col flex-1 min-w-0">
                    <KeyValueRow name="Created At">
                        <DateWithTooltip date={meta.created_at} />
                    </KeyValueRow>
                    <KeyValueRow name="Updated At">
                        <DateWithTooltip date={meta.updated_at} />
                    </KeyValueRow>
                    <KeyValueRow name="Expires At">
                        {meta.expires_at ? <DateWithTooltip date={meta.expires_at} /> : <NullBadge label="none" />}
                    </KeyValueRow>
                </div>
            </div>
            <Divider />
            <div className="w-full flex flex-col lg:flex-row lg:gap-8">
                <div className="flex flex-col flex-1 min-w-0">
                    <KeyValueRow name="Copies">
                        <Field>{meta.copies}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Grouping">
                        <RuleGroupingBadge value={meta.grouping} />
                    </KeyValueRow>
                    <KeyValueRow name="Notification">
                        <RuleNotificationBadge value={meta.notification} />
                    </KeyValueRow>
                    <KeyValueRow name="Priority">
                        <Field>{meta.priority}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Activity">
                        <Field>{meta.activity}</Field>
                    </KeyValueRow>
                </div>
                <RuleSectionDivider />
                <div className="flex flex-col flex-1 min-w-0">
                    <KeyValueRow name="Child Rule ID">
                        {meta.child_rule_id ?
                            <CopyableLinkCell
                                text={meta.child_rule_id}
                                href={`/rule/${encodeURIComponent(meta.child_rule_id)}`}
                            >
                                <Field>{meta.child_rule_id}</Field>
                            </CopyableLinkCell>
                            :
                            <NullBadge label="none" />
                        }
                    </KeyValueRow>
                    <KeyValueRow name="Subscription ID">
                        {meta.subscription_id ?
                            <CopyableLinkCell
                                text={meta.subscription_id}
                                href={`/subscriptions?autoSearch=true`}
                            >
                                <Field>{meta.subscription_id}</Field>
                            </CopyableLinkCell>
                            :
                            <NullBadge label="none" />
                        }
                    </KeyValueRow>
                    <KeyValueRow name="Source Replica Expression">
                        {meta.source_replica_expression ?
                            <Field>{meta.source_replica_expression}</Field>
                            :
                            <NullBadge label="none" />
                        }
                    </KeyValueRow>
                    <KeyValueRow name="Weight">
                        {meta.weight ? <Field>{meta.weight}</Field> : <NullBadge label="none" />}
                    </KeyValueRow>
                    <KeyValueRow name="End Of Life">
                        {meta.eol_at ? <DateWithTooltip date={meta.eol_at} /> : <NullBadge label="none" />}
                    </KeyValueRow>
                </div>
                <RuleSectionDivider />
                <div className="flex flex-col flex-1 min-w-0">
                    <KeyValueRow name="Purge Replicas">
                        <Checkbox checked={meta.purge_replicas} />
                    </KeyValueRow>
                    <KeyValueRow name="Split Container">
                        <Checkbox checked={meta.split_container} />
                    </KeyValueRow>
                    <KeyValueRow name="Locked">
                        <Checkbox checked={meta.locked} />
                    </KeyValueRow>
                    <KeyValueRow name="Ignore Account Limit">
                        <Checkbox checked={meta.ignore_account_limit} />
                    </KeyValueRow>
                    <KeyValueRow name="Ignore Availability">
                        <Checkbox checked={meta.ignore_availability} />
                    </KeyValueRow>
                </div>
            </div>
            {meta.comments && (
                <div className="w-full pt-2">
                    <span className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">Comments</span>
                    <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap wrap-break-word">{meta.comments}</p>
                </div>
            )}
        </KeyValueWrapper>
    );
};
