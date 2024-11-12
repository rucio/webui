import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';
import { Divider } from '@/component-library/atoms/misc/Divider';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { Field } from '@/component-library/atoms/misc/Field';
import { formatDate, formatFileSize } from '@/component-library/features/utils/text-formatters';
import { CopyableField } from '@/component-library/features/fields/CopyableField';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { DIDAvailabilityBadge } from '@/component-library/features/badges/DID/DIDAvailabilityBadge';
import Checkbox from '@/component-library/atoms/form/Checkbox';
import { DIDType } from '@/lib/core/entity/rucio';

export const DetailsDIDMeta = ({ meta }: { meta: DIDMetaViewModel }) => {
    const getFileInformation = () => {
        return (
            <div>
                <Divider className="2xl:hidden" />
                {meta.bytes && (
                    <KeyValueRow name="Size">
                        <Field>{formatFileSize(meta.bytes)}</Field>
                    </KeyValueRow>
                )}
                {meta.guid && (
                    <KeyValueRow name="GUID">
                        <CopyableField text={meta.guid} />
                    </KeyValueRow>
                )}
                {meta.adler32 && (
                    <KeyValueRow name="Adler32">
                        <CopyableField text={meta.adler32} />
                    </KeyValueRow>
                )}
                {meta.md5 && (
                    <KeyValueRow name="MD5">
                        <CopyableField text={meta.md5} />
                    </KeyValueRow>
                )}
            </div>
        );
    };

    return (
        <KeyValueWrapper className="flex 2xl:flex-row flex-col py-3 px-5">
            <div className="flex lg:flex-row flex-col lg:justify-between grow">
                <div>
                    <KeyValueRow name="Type">
                        <DIDTypeBadge value={meta.did_type} />
                    </KeyValueRow>
                    <KeyValueRow name="Account">
                        <Field>{meta.account}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Created At">
                        <Field>{formatDate(meta.created_at)}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Updated At">
                        <Field>{formatDate(meta.updated_at)}</Field>
                    </KeyValueRow>
                    <KeyValueRow name="Availability">
                        <DIDAvailabilityBadge value={meta.availability} />
                    </KeyValueRow>
                    {meta.is_open !== null && (
                        <KeyValueRow name="Is Open">
                            <Checkbox checked={meta.is_open} />
                        </KeyValueRow>
                    )}
                </div>

                <Divider className="lg:hidden" />

                <div>
                    <KeyValueRow name="Monotonic">
                        <Checkbox checked={meta.monotonic} />
                    </KeyValueRow>
                    <KeyValueRow name="Obsolete">
                        <Checkbox checked={meta.obsolete} />
                    </KeyValueRow>
                    <KeyValueRow name="Hidden">
                        <Checkbox checked={meta.hidden} />
                    </KeyValueRow>
                    <KeyValueRow name="Suppressed">
                        <Checkbox checked={meta.suppressed} />
                    </KeyValueRow>
                    <KeyValueRow name="Purge Replicas">
                        <Checkbox checked={meta.purge_replicas} />
                    </KeyValueRow>
                </div>
            </div>

            {meta.did_type === DIDType.FILE && getFileInformation()}
        </KeyValueWrapper>
    );
};
