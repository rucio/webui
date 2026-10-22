import React, { useState } from 'react';
import { Input } from '@/component-library/atoms/form/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { Button } from '@/component-library/atoms/form/button';

export type ReplicaPFNDomain = 'auto' | 'wan' | 'lan' | 'all';

/**
 * Options of `rucio replica list file` exposed in the replica views.
 */
export type ReplicaPFNOptionsValue = {
    /** Comma separated schemes (`--protocols`), empty for the server default */
    protocols: string;
    /** `--domain`; auto lets Rucio pick from the client location */
    domain: ReplicaPFNDomain;
    /** `--rses` */
    rseExpression: string;
    /** `--all-states`; on by default to keep showing every replica */
    includeUnavailable: boolean;
    /** `--missing`: only replicas that are not AVAILABLE on the RSE expression */
    missingOnly: boolean;
};

export const DEFAULT_REPLICA_PFN_OPTIONS: ReplicaPFNOptionsValue = {
    protocols: '',
    domain: 'auto',
    rseExpression: '',
    includeUnavailable: true,
    missingOnly: false,
};

/**
 * Builds the query string shared by list-file-replicas and get-file-replicas-metalink.
 */
export const buildReplicaPFNQuery = (scope: string, name: string, options: ReplicaPFNOptionsValue): URLSearchParams => {
    const params = new URLSearchParams({ scope, name });
    options.protocols
        .split(',')
        .map(protocol => protocol.trim())
        .filter(Boolean)
        .forEach(protocol => params.append('schemes', protocol));
    if (options.domain !== 'auto') params.set('domain', options.domain);
    const rseExpression = options.rseExpression.trim();
    if (rseExpression) params.set('rseExpression', rseExpression);
    // --missing implies all states, like the CLI
    const allStates = options.includeUnavailable || (options.missingOnly && !!rseExpression);
    params.set('allStates', String(allStates));
    return params;
};

const DOMAIN_LABELS: Record<ReplicaPFNDomain, string> = {
    auto: 'Auto',
    wan: 'WAN',
    lan: 'LAN',
    all: 'All',
};

function OptionField({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 min-w-0">
            <label htmlFor={htmlFor} className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {label}
            </label>
            {children}
        </div>
    );
}

function OptionCheckbox(props: { id: string; label: string; checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) {
    return (
        <label
            htmlFor={props.id}
            className={`flex items-center gap-2 h-10 select-none ${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
            <Checkbox id={props.id} checked={props.checked} disabled={props.disabled} onCheckedChange={checked => props.onChange(checked === true)} />
            <span className="text-sm text-neutral-900 dark:text-neutral-100 whitespace-nowrap">{props.label}</span>
        </label>
    );
}

export type ReplicaPFNOptionsProps = {
    /** Prefix for element ids, so several bars can live on one page */
    idPrefix: string;
    value: ReplicaPFNOptionsValue;
    onApply: (value: ReplicaPFNOptionsValue) => void;
    onCopyPFNs: () => void;
    onDownloadMetalink: () => void;
    isDownloading?: boolean;
    /** Disables the actions, e.g. while no file is selected */
    disabled?: boolean;
};

/**
 * Compact bar with the `rucio replica list file` options and the PFN export actions.
 * Changes are applied with the Apply button or Enter, so typing does not restart the stream.
 */
export const ReplicaPFNOptions = ({ idPrefix, value, onApply, onCopyPFNs, onDownloadMetalink, isDownloading, disabled }: ReplicaPFNOptionsProps) => {
    const [draft, setDraft] = useState<ReplicaPFNOptionsValue>(value);
    const update = (changes: Partial<ReplicaPFNOptionsValue>) => setDraft(previous => ({ ...previous, ...changes }));
    const hasRSEExpression = draft.rseExpression.trim() !== '';
    const apply = () => onApply({ ...draft, missingOnly: draft.missingOnly && hasRSEExpression });

    return (
        <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-end gap-2 p-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-0 dark:bg-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:flex-1 min-w-0">
                <OptionField label="Protocols" htmlFor={`${idPrefix}-protocols`}>
                    <Input
                        id={`${idPrefix}-protocols`}
                        placeholder="Default, e.g. root, davs"
                        value={draft.protocols}
                        onChange={event => update({ protocols: event.target.value })}
                        onEnterKey={apply}
                    />
                </OptionField>
                <OptionField label="Domain" htmlFor={`${idPrefix}-domain`}>
                    <Select value={draft.domain} onValueChange={domain => update({ domain: domain as ReplicaPFNDomain })}>
                        <SelectTrigger id={`${idPrefix}-domain`} aria-label="Domain">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.keys(DOMAIN_LABELS) as ReplicaPFNDomain[]).map(domain => (
                                <SelectItem key={domain} value={domain}>
                                    {DOMAIN_LABELS[domain]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </OptionField>
                <OptionField label="RSE expression" htmlFor={`${idPrefix}-rse-expression`}>
                    <Input
                        id={`${idPrefix}-rse-expression`}
                        placeholder="All RSEs"
                        value={draft.rseExpression}
                        onChange={event => update({ rseExpression: event.target.value })}
                        onEnterKey={apply}
                    />
                </OptionField>
            </div>
            <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <OptionCheckbox
                    id={`${idPrefix}-include-unavailable`}
                    label="Include unavailable"
                    checked={draft.includeUnavailable || (draft.missingOnly && hasRSEExpression)}
                    disabled={draft.missingOnly && hasRSEExpression}
                    onChange={includeUnavailable => update({ includeUnavailable })}
                />
                <OptionCheckbox
                    id={`${idPrefix}-missing-only`}
                    label="Missing only"
                    checked={draft.missingOnly && hasRSEExpression}
                    disabled={!hasRSEExpression}
                    onChange={missingOnly => update({ missingOnly })}
                />
                <Button size="default" onClick={apply} disabled={disabled}>
                    Apply
                </Button>
                <Button size="default" variant="neutral" onClick={onCopyPFNs} disabled={disabled}>
                    Copy PFNs
                </Button>
                <Button size="default" variant="neutral" onClick={onDownloadMetalink} loading={isDownloading} disabled={disabled}>
                    Download metalink
                </Button>
            </div>
        </div>
    );
};
