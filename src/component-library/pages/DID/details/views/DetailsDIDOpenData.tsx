'use client';

import { useQuery } from '@tanstack/react-query';
import { DetailsDIDView } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import { JSONViewer } from '@/component-library/features/json';
import { OpenDataDownloadMenu } from './OpenDataDownloadMenu';

type OpenDataFileResponse = {
    scope: string;
    name: string;
    download_urls: string[];
};

type OpenDataResponse = {
    status: 'success' | 'error';
    scope: string;
    name: string;
    state?: string;
    doi?: string | null;
    record_id?: number | string | null;
    files?: OpenDataFileResponse[];
    meta?: Record<string, unknown>;
    message?: string;
};

type MetadataObject = Record<string, unknown>;

const isObject = (value: unknown): value is MetadataObject => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const getString = (
    object: MetadataObject,
    key: string,
): string | undefined => {
    const value = object[key];

    return typeof value === 'string'
        ? value
        : undefined;
};

const getObject = (
    object: MetadataObject,
    key: string,
): MetadataObject | undefined => {
    const value = object[key];

    return isObject(value)
        ? value
        : undefined;
};

const getStringArray = (
    object: MetadataObject,
    key: string,
): string[] => {
    const value = object[key];

    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(
        (item): item is string => typeof item === 'string',
    );
};

export const DetailsDIDOpenData: DetailsDIDView = ({
    scope,
    name,
    isActive,
}) => {
    const queryOpenData = async (): Promise<OpenDataResponse> => {
        const url =
            '/api/feature/get-opendata-did?' +
            new URLSearchParams({
                scope,
                name,
            });

        const res = await fetch(url);

        if (!res.ok) {
            const body = await res.text();

            throw new Error(
                `Failed to load OpenData metadata: ${res.status} ${res.statusText} - ${body}`,
            );
        }

        return res.json();
    };

    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['opendata', scope, name],
        queryFn: queryOpenData,
        enabled: isActive === true,
        refetchOnWindowFocus: false,
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="p-4">
                Loading OpenData metadata...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                {error instanceof Error
                    ? error.message
                    : 'Failed to load OpenData metadata.'}
            </div>
        );
    }

    const meta = data?.meta ?? {};
    const files = data?.files ?? [];

    /*
     * Common CERN Open Data metadata
     */

    const title = getString(meta, 'title');
    const publisher = getString(meta, 'publisher');
    const datePublished = getString(meta, 'date_published');
    const accelerator = getString(meta, 'accelerator');

    const experiments = getStringArray(meta, 'experiment');

    /*
     * Type
     */

    const typeObject = getObject(meta, 'type');

    const primaryType =
        typeObject
            ? getString(typeObject, 'primary')
            : undefined;

    const secondaryTypes =
        typeObject
            ? getStringArray(typeObject, 'secondary')
            : [];

    /*
     * Collaboration
     */

    const collaborationObject = getObject(meta, 'collaboration');

    const collaboration =
        collaborationObject
            ? getString(collaborationObject, 'name')
            : undefined;

    /*
     * Abstract
     */

    const abstractObject = getObject(meta, 'abstract');

    const abstract =
        abstractObject
            ? getString(abstractObject, 'description')
            : undefined;

    /*
     * Structured Rucio OpenData fields
     *
     * Rucio values have priority over metadata JSON values.
     */

    const state = data?.state;

    const metadataDOI = getString(meta, 'doi');

    const rucioDOI =
        data?.doi !== undefined && data.doi !== null
            ? data.doi
            : undefined;

    const doi =
        rucioDOI ??
        metadataDOI;

    const doiMismatch =
        rucioDOI !== undefined &&
        metadataDOI !== undefined &&
        rucioDOI !== metadataDOI;

    const metadataRecordIdValue = meta.recid;

    const metadataRecordId =
        typeof metadataRecordIdValue === 'string' ||
        typeof metadataRecordIdValue === 'number'
            ? String(metadataRecordIdValue)
            : undefined;

    const rucioRecordId =
        data?.record_id !== undefined &&
        data.record_id !== null
            ? String(data.record_id)
            : undefined;

    const recordId =
        rucioRecordId ??
        metadataRecordId;

    const recordIdMismatch =
        rucioRecordId !== undefined &&
        metadataRecordId !== undefined &&
        rucioRecordId !== metadataRecordId;

    return (
        <div className="p-4 overflow-auto space-y-8">
            <section>
                <h2 className="text-lg font-semibold mb-4">
                    OpenData metadata
                </h2>

                <div className="space-y-3">
                    <div>
                        <span className="font-semibold">
                            DID:{' '}
                        </span>

                        <span>
                            {scope}:{name}
                        </span>
                    </div>

                    {state && (
                        <div>
                            <span className="font-semibold">
                                State:{' '}
                            </span>

                            <span>
                                {state}
                            </span>
                        </div>
                    )}

                    {title && (
                        <div>
                            <span className="font-semibold">
                                Title:{' '}
                            </span>

                            <span>
                                {title}
                            </span>
                        </div>
                    )}

                    {experiments.length > 0 && (
                        <div>
                            <span className="font-semibold">
                                Experiment:{' '}
                            </span>

                            <span>
                                {experiments.join(', ')}
                            </span>
                        </div>
                    )}

                    {primaryType && (
                        <div>
                            <span className="font-semibold">
                                Type:{' '}
                            </span>

                            <span>
                                {primaryType}
                            </span>
                        </div>
                    )}

                    {secondaryTypes.length > 0 && (
                        <div>
                            <span className="font-semibold">
                                Category:{' '}
                            </span>

                            <span>
                                {secondaryTypes.join(', ')}
                            </span>
                        </div>
                    )}

                    {collaboration && (
                        <div>
                            <span className="font-semibold">
                                Collaboration:{' '}
                            </span>

                            <span>
                                {collaboration}
                            </span>
                        </div>
                    )}

                    {accelerator && (
                        <div>
                            <span className="font-semibold">
                                Accelerator:{' '}
                            </span>

                            <span>
                                {accelerator}
                            </span>
                        </div>
                    )}

                    {datePublished && (
                        <div>
                            <span className="font-semibold">
                                Published:{' '}
                            </span>

                            <span>
                                {datePublished}
                            </span>
                        </div>
                    )}

                    {publisher && (
                        <div>
                            <span className="font-semibold">
                                Publisher:{' '}
                            </span>

                            <span>
                                {publisher}
                            </span>
                        </div>
                    )}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-4">
                    Files
                </h2>

                {files.length === 0 ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        No files available.
                    </p>
                ) : (
                    <div className="overflow-visible rounded border border-neutral-200 dark:border-neutral-700">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-100 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        File
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Download
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {files.map(file => (
                                    <tr
                                        key={`${file.scope}:${file.name}`}
                                        className="border-t border-neutral-200 dark:border-neutral-700"
                                    >
                                        <td className="px-4 py-3">
                                            {file.scope}:{file.name}
                                        </td>

                                        <td className="px-4 py-3">
                                            <OpenDataDownloadMenu
                                                urls={file.download_urls}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {(doi || recordId) && (
                <section>
                    <h2 className="text-lg font-semibold mb-4">
                        External identifiers
                    </h2>

                    <div className="space-y-4">
                        {doi && (
                            <div>
                                <div>
                                    <span className="font-semibold">
                                        DOI:{' '}
                                    </span>

                                    <a
                                        href={`https://doi.org/${doi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        {doi}
                                    </a>
                                </div>

                                {doiMismatch && (
                                    <div className="mt-2 rounded border border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-900">
                                        Warning: the DOI stored in Rucio differs
                                        from the DOI in the OpenData metadata.
                                        The Rucio value is being used.
                                    </div>
                                )}
                            </div>
                        )}

                        {recordId && (
                            <div>
                                <div>
                                    <span className="font-semibold">
                                        CERN Open Data record:{' '}
                                    </span>

                                    <a
                                        href={`https://opendata.cern.ch/record/${recordId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        {recordId}
                                    </a>
                                </div>

                                {recordIdMismatch && (
                                    <div className="mt-2 rounded border border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-900">
                                        Warning: the record ID stored in Rucio
                                        differs from the record ID in the
                                        OpenData metadata. The Rucio value is
                                        being used.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {abstract && (
                <section>
                    <h2 className="text-lg font-semibold mb-4">
                        Abstract
                    </h2>

                    <p className="whitespace-pre-wrap">
                        {abstract}
                    </p>
                </section>
            )}

            <section>
                <h2 className="text-lg font-semibold mb-4">
                    Raw JSON
                </h2>

                <pre className="whitespace-pre-wrap break-words overflow-auto rounded border p-4">
                    <JSONViewer value={JSON.stringify(meta, null, 2)} />
                </pre>
            </section>
        </div>
    );
};