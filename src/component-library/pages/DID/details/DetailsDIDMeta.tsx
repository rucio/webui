import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';
import { Divider } from '@/component-library/atoms/misc/Divider';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { Field } from '@/component-library/atoms/misc/Field';
import { formatDate, formatFileSize } from '@/component-library/features/utils/text-formatters';
import { CopyableField } from '@/component-library/features/fields/CopyableField';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { DIDAvailabilityBadge } from '@/component-library/features/badges/DID/DIDAvailabilityBadge';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { DIDType } from '@/lib/core/entity/rucio';

/**
 * A responsive divider component for DID metadata sections.
 * Renders a horizontal divider on mobile/tablet and a vertical divider on lg+ screens.
 */
const MetaSectionDivider = () => (
    <>
        {/* Horizontal divider for mobile/tablet */}
        <div className="w-full lg:hidden">
            <Divider />
        </div>
        {/* Vertical divider for lg and above */}
        <div className="hidden lg:block h-auto">
            <Divider orientation="vertical" spacing="md" />
        </div>
    </>
);

/**
 * A responsive divider component for file information section.
 * Renders a horizontal divider on mobile/xl and a vertical divider on 2xl+ screens.
 */
const FileInfoDivider = () => (
    <>
        {/* Horizontal divider for smaller screens */}
        <div className="w-full 2xl:hidden">
            <Divider />
        </div>
        {/* Vertical divider for 2xl and above */}
        <div className="hidden 2xl:block h-auto">
            <Divider orientation="vertical" spacing="md" />
        </div>
    </>
);

export const DetailsDIDMeta = ({ meta }: { meta: DIDMetaViewModel }) => {
    const getFileInformation = () => {
        return (
            <>
                <FileInfoDivider />
                <div>
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
            </>
        );
    };

    return (
        <KeyValueWrapper className="flex 2xl:flex-row flex-col p-6">
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

                <MetaSectionDivider />

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
