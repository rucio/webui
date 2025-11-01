import React from 'react';
import { Divider } from '@/component-library/atoms/misc/Divider';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { Field } from '@/component-library/atoms/misc/Field';
import { formatDate } from '@/component-library/features/utils/text-formatters';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { RuleMetaViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import { RuleStateBadge } from '@/component-library/features/badges/Rule/RuleStateBadge';
import { RuleGroupingBadge } from '@/component-library/features/badges/Rule/RuleGroupingBadge';
import { RuleNotificationBadge } from '@/component-library/features/badges/Rule/RuleNotificationBadge';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { CopyableLinkCell } from '@/component-library/features/table/cells/CopyableCell';

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
    const getExpiredField = () => {
        if (meta.expires_at) {
            return <Field>{formatDate(meta.expires_at)}</Field>;
        } else {
            return <NullBadge />;
        }
    };

    return (
        <KeyValueWrapper className="w-full p-4 flex flex-col ">
            <div className="w-full flex flex-col lg:flex-row justify-between">
                <div className="flex flex-col">
                    <KeyValueRow name="State">
                        <RuleStateBadge value={meta.state} />
                    </KeyValueRow>
                    <KeyValueRow name="DID">
                        <div className="flex flex-row gap-2 overflow-hidden items-center">
                            <CopyableLinkCell
                                text={`${meta.scope}:${meta.name}`}
                                href={`/did/page/${encodeURIComponent(meta.scope)}/${encodeURIComponent(meta.name)}`}
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
                        <Field>{meta.rse_expression}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Account">
                        <Field>{meta.account}</Field>
                    </KeyValueRow>
                </div>
                <RuleSectionDivider />
                <div className="flex flex-col">
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
                <div className="flex flex-col">
                    <KeyValueRow name="Created At">
                        <Field>{formatDate(meta.created_at)}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Updated At">
                        <Field>{formatDate(meta.updated_at)}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Expires At">{getExpiredField()}</KeyValueRow>
                </div>
            </div>
            <Divider />
            <div className="w-full flex flex-col lg:flex-row justify-between">
                <div className="flex flex-col">
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
                <div className="flex flex-col">
                    <KeyValueRow name="Purge Replicas">
                        <Checkbox checked={meta.purge_replicas} />
                    </KeyValueRow>
                    <KeyValueRow name="Split Container">
                        <Checkbox checked={meta.split_container} />
                    </KeyValueRow>
                    <KeyValueRow name="Locked">
                        <Checkbox checked={meta.locked} />
                    </KeyValueRow>
                </div>
                <RuleSectionDivider />
                <div className="flex flex-col">
                     <KeyValueRow name="Ignore Account Limit">
                        <Checkbox checked={meta.ignore_account_limit} />
                    </KeyValueRow>
                    <KeyValueRow name="Ignore Availability">
                        <Checkbox checked={meta.ignore_availability} />
                    </KeyValueRow>
                </div>
            </div>
        </KeyValueWrapper>
    );
};
