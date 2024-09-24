import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';
import { cn } from '@/component-library/utils';
import { Field } from '@/component-library/atoms/misc/Field';
import { formatDate, formatFileSize } from '@/component-library/features/utils/text-formatters';
import { Divider } from '@/component-library/atoms/misc/Divider';
import Checkbox from '@/component-library/atoms/form/Checkbox';
import { DIDType } from '@/lib/core/entity/rucio';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { CopyableField } from '@/component-library/features/fields/CopyableField';
import { DIDAvailabilityBadge } from '@/component-library/features/badges/DID/DIDAvailabilityBadge';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import {KeyValueLinkHeader} from "@/component-library/features/key-value/headers";
import {KeyValueRow} from "@/component-library/features/key-value/KeyValueRow";
import {KeyValueWrapper} from "@/component-library/features/key-value/KeyValueWrapper";

const MetaHeader = ({ scope, name }: { scope: string; name: string }) => {
    return (
        <KeyValueLinkHeader href={`/did/page/${scope}/${name}`}>
            <span>{scope}:{name}</span>
        </KeyValueLinkHeader>
    );
};

const MetaContents = ({ meta }: { meta: DIDMetaViewModel }) => {
    const getFileInformation = () => {
        return (
            <>
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
                <Divider />
            </>
        );
    };

    return (
        <div className="min-w-full w-fit md:max-h-[0px]">
            <MetaHeader scope={meta.scope} name={meta.name} />
            <div className="flex flex-col px-4 py-2 w-full">
                <KeyValueRow name="Type">
                    <DIDTypeBadge value={meta.did_type} />
                </KeyValueRow>
                <KeyValueRow name="Account">
                    <Field>{meta.account}</Field>
                </KeyValueRow>
                {meta.is_open !== null && (
                    <KeyValueRow name="Is Open">
                        <Checkbox checked={meta.is_open} />
                    </KeyValueRow>
                )}
                <KeyValueRow name="Monotonic">
                    <Checkbox checked={meta.monotonic} />
                </KeyValueRow>
                <Divider />
                <KeyValueRow name="Created At">
                    <Field>{formatDate(meta.created_at)}</Field>
                </KeyValueRow>
                <KeyValueRow name="Updated At">
                    <Field>{formatDate(meta.updated_at)}</Field>
                </KeyValueRow>
                <Divider />
                {meta.did_type === DIDType.FILE && getFileInformation()}
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
                <KeyValueRow name="Availability">
                    <DIDAvailabilityBadge value={meta.availability} />
                </KeyValueRow>
            </div>
        </div>
    );
};

const MetaStub = ({ isLoading, hasError }: { isLoading: boolean; hasError: boolean }) => {
    const getTextStub = () => {
        return <span className="text-sm text-neutral-800 dark:text-neutral-100">{hasError ? 'An error has happened' : 'Select an identifier'}</span>;
    };

    return <div className="justify-center flex grow">{isLoading ? <LoadingSpinner /> : getTextStub()}</div>;
};

export interface ListDIDMetaProps {
    meta?: DIDMetaViewModel;
    isLoading: boolean;
    hasError: boolean;
}

export const ListDIDMeta = ({ meta, isLoading, hasError }: ListDIDMetaProps) => {
    const showMeta = meta && !isLoading && !hasError;

    return (
        <KeyValueWrapper
            className={cn(
                showMeta ? 'flex-none' : 'flex grow items-center min-h-[10rem]',
                'md:flex-1 overflow-auto',
            )}
        >
            {showMeta ? <MetaContents meta={meta} /> : <MetaStub isLoading={isLoading} hasError={hasError} />}
        </KeyValueWrapper>
    );
};
