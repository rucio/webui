import React from 'react';
import { HiOutlineIdentification, HiOutlineTag } from 'react-icons/hi';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { DateWithTooltip } from '@/component-library/features/utils/DateWithTooltip';
import { AccountTypeBadge } from '@/component-library/features/badges/account/AccountTypeBadge';
import { AccountStatusBadge } from '@/component-library/features/badges/account/AccountStatusBadge';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import { AccountInfo } from '@/lib/core/entity/rucio';
import { AccountTab } from './details-account-types';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const SummaryTile = ({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-0 dark:bg-neutral-800 px-4 py-3 text-left text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500"
    >
        <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
        {label}
    </button>
);

export interface DetailsAccountOverviewProps {
    info: AccountInfo;
    /** Counts for the summary tiles; undefined while loading. Tiles are hidden for non-ACTIVE accounts. */
    identitiesCount?: number;
    attributesCount?: number;
    showTiles: boolean;
    onOpenTab: (tab: AccountTab) => void;
}

/** The Overview tab: account fields in two columns and summary tiles that open the other tabs. */
export const DetailsAccountOverview = ({ info, identitiesCount, attributesCount, showTiles, onOpenTab }: DetailsAccountOverviewProps) => (
    <div className="flex flex-col gap-4">
        <KeyValueWrapper className="w-full p-6 flex flex-col lg:flex-row lg:gap-8">
            <div className="flex flex-col flex-1">
                <KeyValueRow name="Account">
                    <span className="font-mono">{info.account}</span>
                </KeyValueRow>
                <KeyValueRow name="Type">
                    <AccountTypeBadge value={info.accountType} />
                </KeyValueRow>
                <KeyValueRow name="Status">
                    <AccountStatusBadge value={info.accountStatus} />
                </KeyValueRow>
                <KeyValueRow name="Email">{info.email ? <span>{info.email}</span> : <NullBadge label="none" />}</KeyValueRow>
            </div>
            <div className="flex flex-col flex-1">
                <KeyValueRow name="Created">
                    <DateWithTooltip date={info.createdAt} />
                </KeyValueRow>
                <KeyValueRow name="Updated">
                    <DateWithTooltip date={info.updatedAt} />
                </KeyValueRow>
                {info.suspendedAt && (
                    <KeyValueRow name="Suspended at">
                        <DateWithTooltip date={info.suspendedAt} />
                    </KeyValueRow>
                )}
                {info.deletedAt && (
                    <KeyValueRow name="Deleted at">
                        <DateWithTooltip date={info.deletedAt} />
                    </KeyValueRow>
                )}
            </div>
        </KeyValueWrapper>
        {showTiles && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SummaryTile
                    icon={HiOutlineIdentification}
                    label={identitiesCount === undefined ? 'Identities' : plural(identitiesCount, 'identity', 'identities')}
                    onClick={() => onOpenTab('identities')}
                />
                <SummaryTile
                    icon={HiOutlineTag}
                    label={attributesCount === undefined ? 'Attributes' : plural(attributesCount, 'attribute', 'attributes')}
                    onClick={() => onOpenTab('attributes')}
                />
            </div>
        )}
    </div>
);
