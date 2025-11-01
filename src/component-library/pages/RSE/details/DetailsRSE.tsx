'use client';

import { CopyableHeading, Heading } from '@/component-library/atoms/misc/Heading';
import { RSEAttributeViewModel, RSEDetailsViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { RSETypeBadge } from '@/component-library/features/badges/RSE/RSETypeBadge';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { RSEAvailabilityBadge } from '@/component-library/features/badges/RSE/RSEAvailabilityBadge';
import { DetailsRSEProtocolsTable } from '@/component-library/pages/RSE/details/DetailsRSEProtocolsTable';
import { DetailsRSEAttributesTable } from '@/component-library/pages/RSE/details/DetailsRSEAttributesTable';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { RSEDetailsProtocol } from '@/lib/core/entity/rucio';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { Divider } from '@/component-library/atoms/misc/Divider';

/**
 * A responsive divider component for RSE sections.
 *
 * Renders a full-width divider that is only visible on screens smaller than the 'lg' breakpoint.
 * Useful for visually separating sections in mobile and tablet layouts.
 *
 * @returns {React.ReactElement} The divider element.
 */
const RSESectionDivider = () => (
    <div className="w-full lg:hidden my-4">
        <Divider />
    </div>
);

const DetailsRSEKeyValues = ({ meta }: { meta: RSEDetailsViewModel }) => {
    return (
        <KeyValueWrapper className="w-full p-6 flex flex-col gap-6">
            <div className="w-full flex flex-col lg:flex-row lg:gap-8">
                <div className="flex flex-col flex-1">
                    <KeyValueRow name="Type">
                        <RSETypeBadge value={meta.rse_type} />
                    </KeyValueRow>
                    <KeyValueRow name="Availability">
                        <div className="flex flex-wrap gap-2">
                            {meta.availability_read && <RSEAvailabilityBadge operation="Read" />}
                            {meta.availability_write && <RSEAvailabilityBadge operation="Write" />}
                            {meta.availability_delete && <RSEAvailabilityBadge operation="Delete" />}
                        </div>
                    </KeyValueRow>
                    <KeyValueRow name="Volatile">
                        <Checkbox checked={meta.volatile} />
                    </KeyValueRow>
                </div>
                <RSESectionDivider />
                <div className="flex flex-col flex-1">
                    <KeyValueRow name="Deterministic">
                        <Checkbox checked={meta.deterministic} />
                    </KeyValueRow>
                    <KeyValueRow name="Staging Area">
                        <Checkbox checked={meta.staging_area} />
                    </KeyValueRow>
                </div>
            </div>
        </KeyValueWrapper>
    );
};

const DetailsRSEAttributes = ({ attributes }: { attributes: RSEAttributeViewModel }) => {
    return (
        <>
            <Heading text="Attributes" size="md" />
            {attributes.attributes.length !== 0 ? (
                <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-20rem)]">
                    <DetailsRSEAttributesTable viewModel={attributes} />
                </div>
            ) : (
                <InfoField>
                    <span>No attributes found.</span>
                </InfoField>
            )}
        </>
    );
};

const DetailsRSEProtocols = ({ protocols }: { protocols: RSEDetailsProtocol[] }) => {
    return (
        <>
            <Heading text="Protocols" size="md" />
            {protocols.length !== 0 ? (
                <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-35rem)]">
                    <DetailsRSEProtocolsTable rowData={protocols} />
                </div>
            ) : (
                <InfoField>
                    <span>No protocols found.</span>
                </InfoField>
            )}
        </>
    );
};

type DetailsRSEProps = {
    name: string;
    initialMeta?: RSEDetailsViewModel;
};

export const DetailsRSE = (props: DetailsRSEProps) => {
    const { toast } = useToast();
    const validator = new BaseViewModelValidator(toast);

    const queryMeta = async () => {
        const url = '/api/feature/get-rse?' + new URLSearchParams({ rseName: props.name });

        const res = await fetch(url);
        if (!res.ok) {
            try {
                const json = await res.json();
                toast({
                    title: 'Fatal error',
                    description: json.message,
                    variant: 'error',
                });
            } catch (e) {}
            throw new Error(res.statusText);
        }

        const json = await res.json();
        if (validator.isValid(json)) return json;

        return null;
    };

    const metaQueryKey = ['meta'];
    const {
        data: meta,
        error: metaError,
        isFetching: isMetaFetching,
    } = useQuery<RSEDetailsViewModel>({
        queryKey: metaQueryKey,
        initialData: props.initialMeta,
        queryFn: queryMeta,
        enabled: !props.initialMeta,
    });

    const queryAttributes = async () => {
        const url = '/api/feature/get-rse-attributes?' + new URLSearchParams({ rseName: props.name });

        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);

        const json = await res.json();
        if (validator.isValid(json)) return json;

        return null;
    };

    const attributesQueryKey = ['attributes'];
    const {
        data: attributes,
        error: attributesError,
        isFetching: isAttributesFetching,
    } = useQuery<RSEAttributeViewModel>({
        queryKey: attributesQueryKey,
        queryFn: queryAttributes,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const hasError = metaError || attributesError;
    if (hasError) {
        return (
            <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                    <WarningField>
                        <span>Could not load the RSE {props.name}.</span>
                    </WarningField>
                </div>
            </main>
        );
    }

    const isLoading = isMetaFetching || meta === undefined;
    if (isLoading) {
        return (
            <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                    <div className="flex grow items-center justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <div className="flex flex-col space-y-6 w-full">
                    <header className="mb-2">
                        <CopyableHeading text={props.name} />
                    </header>
                    <DetailsRSEKeyValues meta={meta} />
                    <DetailsRSEProtocols protocols={meta.protocols} />
                    {!isAttributesFetching && attributes !== undefined && <DetailsRSEAttributes attributes={attributes} />}
                </div>
            </div>
        </main>
    );
};
