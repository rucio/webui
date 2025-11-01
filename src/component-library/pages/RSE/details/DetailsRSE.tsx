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

const DetailsRSEKeyValues = ({ meta }: { meta: RSEDetailsViewModel }) => {
    return (
        <KeyValueWrapper className="flex sm:flex sm:flex-row flex-col p-3">
            <div className="grow">
                <KeyValueRow name="Type">
                    <RSETypeBadge value={meta.rse_type} />
                </KeyValueRow>
                <KeyValueRow name="Availability">
                    {meta.availability_read && <RSEAvailabilityBadge operation="Read" />}
                    {meta.availability_write && <RSEAvailabilityBadge operation="Write" />}
                    {meta.availability_delete && <RSEAvailabilityBadge operation="Delete" />}
                </KeyValueRow>
                <KeyValueRow name="Volatile">
                    <Checkbox checked={meta.volatile} />
                </KeyValueRow>
            </div>
            <div className="grow">
                <KeyValueRow name="Deterministic">
                    <Checkbox checked={meta.deterministic} />
                </KeyValueRow>
                <KeyValueRow name="Staging Area">
                    <Checkbox checked={meta.staging_area} />
                </KeyValueRow>
            </div>
        </KeyValueWrapper>
    );
};

const DetailsRSEAttributes = ({ attributes }: { attributes: RSEAttributeViewModel }) => {
    return attributes.attributes.length !== 0 ? (
        <>
            <Heading text="Attributes" size="md" />
            <DetailsRSEAttributesTable viewModel={attributes} />
        </>
    ) : (
        <InfoField>
            <span>No attributes found.</span>
        </InfoField>
    );
};

const DetailsRSEProtocols = ({ protocols }: { protocols: RSEDetailsProtocol[] }) => {
    return protocols.length !== 0 ? (
        <>
            <Heading text="Protocols" size="md" />
            <DetailsRSEProtocolsTable rowData={protocols} />
        </>
    ) : (
        <InfoField>
            <span>No protocols found.</span>
        </InfoField>
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
            <WarningField>
                <span>Could not load the RSE {props.name}.</span>
            </WarningField>
        );
    }

    const isLoading = isMetaFetching || meta === undefined;
    if (isLoading) {
        return (
            <div className="flex grow items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <CopyableHeading text={props.name} />
            <DetailsRSEKeyValues meta={meta} />
            <DetailsRSEProtocols protocols={meta.protocols} />
            {!isAttributesFetching && attributes !== undefined && <DetailsRSEAttributes attributes={attributes} />}
        </div>
    );
};
