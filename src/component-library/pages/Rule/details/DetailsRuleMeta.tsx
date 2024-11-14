import { Divider } from '@/component-library/atoms/misc/Divider';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { Field } from '@/component-library/atoms/misc/Field';
import { formatDate } from '@/component-library/features/utils/text-formatters';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import Checkbox from '@/component-library/atoms/form/Checkbox';
import { RuleMetaViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import { RuleStateBadge } from '@/component-library/features/badges/Rule/RuleStateBadge';
import { RuleGroupingBadge } from '@/component-library/features/badges/Rule/RuleGroupingBadge';
import { RuleNotificationBadge } from '@/component-library/features/badges/Rule/RuleNotificationBadge';

export const DetailsRuleMeta = ({ meta }: { meta: RuleMetaViewModel }) => {
    const getExpiredField = () => {
        if (meta.expires_at) {
            return <Field>formatDate(meta.expires_at)</Field>;
        } else {
            return <NullBadge />;
        }
    };

    return (
        <KeyValueWrapper className="flex flex-col py-3 px-5">
            <div className="flex flex-col grow">
                <KeyValueRow name="State">
                    <RuleStateBadge value={meta.state} />
                </KeyValueRow>
                <KeyValueRow name="DID">
                    <Field>
                        {meta.scope}:{meta.name}
                    </Field>
                    <DIDTypeBadge value={meta.did_type} />
                </KeyValueRow>
                <KeyValueRow name="RSE Expression">
                    <Field>{meta.rse_expression}</Field>
                </KeyValueRow>
                <KeyValueRow name="Account">
                    <Field>{meta.account}</Field>
                </KeyValueRow>

                <Divider />

                <KeyValueRow name="Locks OK">
                    <Field>{meta.locks_ok_cnt}</Field>
                </KeyValueRow>
                <KeyValueRow name="Locks Replicating">
                    <Field>{meta.locks_replicating_cnt}</Field>
                </KeyValueRow>
                <KeyValueRow name="Locks Stuck">
                    <Field>{meta.locks_stuck_cnt}</Field>
                </KeyValueRow>

                <Divider />

                <KeyValueRow name="Created At">
                    <Field>{formatDate(meta.created_at)}</Field>
                </KeyValueRow>
                <KeyValueRow name="Updated At">
                    <Field>{formatDate(meta.updated_at)}</Field>
                </KeyValueRow>
                <KeyValueRow name="Expires At">{getExpiredField()}</KeyValueRow>

                <Divider />

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

                <Divider />

                <KeyValueRow name="Purge Replicas">
                    <Checkbox checked={meta.purge_replicas} />
                </KeyValueRow>
                <KeyValueRow name="Split Container">
                    <Checkbox checked={meta.split_container} />
                </KeyValueRow>
                <KeyValueRow name="Ignore Account Limit">
                    <Checkbox checked={meta.ignore_account_limit} />
                </KeyValueRow>
                <KeyValueRow name="Ignore Availability">
                    <Checkbox checked={meta.ignore_availability} />
                </KeyValueRow>
                <KeyValueRow name="Locked">
                    <Checkbox checked={meta.locked} />
                </KeyValueRow>
            </div>
        </KeyValueWrapper>
    );
};
