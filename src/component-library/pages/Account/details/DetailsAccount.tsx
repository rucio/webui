'use client';

import React from 'react';
import Link from 'next/link';
import { HiOutlineExternalLink, HiOutlinePause, HiOutlinePencil, HiOutlinePlay, HiOutlineTrash } from 'react-icons/hi';
import { CopyableHeading } from '@/component-library/atoms/misc/Heading';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { Button, buttonVariants } from '@/component-library/atoms/form/button';
import { DetailActions } from '@/component-library/features/mutations/DetailActions';
import { TabSwitcher } from '@/component-library/features/tabs/TabSwitcher';
import { DateWithTooltip } from '@/component-library/features/utils/DateWithTooltip';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { AccountStatusBadge } from '@/component-library/features/badges/account/AccountStatusBadge';
import { AccountTypeBadge } from '@/component-library/features/badges/account/AccountTypeBadge';
import { AccountInfo, AccountStatus } from '@/lib/core/entity/rucio';
import { AccountAttribute, AccountIdentity } from '@/lib/core/entity/account';
import { AccountLimitTarget, AccountLoadError, AccountQuotas, AccountResource, AccountTab, isTruthyAttributeValue } from './details-account-types';
import { AccountStatusBanner } from './AccountStatusBanner';
import { DetailsAccountOverview } from './DetailsAccountOverview';
import { DetailsAccountIdentities } from './DetailsAccountIdentities';
import { DetailsAccountAttributes } from './DetailsAccountAttributes';
import { DetailsAccountQuotas } from './DetailsAccountQuotas';

export interface DetailsAccountProps {
    info: AccountInfo;
    /** The account is the session account ("You" badge). */
    isSelf: boolean;
    /** Edit, suspend/reactivate and identity, attribute and quota changes (admin with accounts.manage). */
    canManage: boolean;
    /** Delete (admin with accounts.manage). */
    canLifecycle: boolean;
    activeTab: AccountTab;
    onTabChange: (tab: AccountTab) => void;
    identities: AccountResource<AccountIdentity[]>;
    attributes: AccountResource<AccountAttribute[]>;
    quotas: AccountResource<AccountQuotas>;
    /** A mutation is running: the other actions are disabled. */
    busy?: boolean;
    onEdit?: () => void;
    onSetStatus?: (mode: 'suspend' | 'reactivate') => void;
    onDelete?: () => void;
    onAddIdentity?: () => void;
    onDeleteIdentity?: (identity: AccountIdentity) => void;
    onAddAttribute?: () => void;
    onDeleteAttribute?: (attribute: AccountAttribute) => void;
    onSetLimit?: (initial?: AccountLimitTarget & { bytes: number }) => void;
    onDeleteLimit?: (target: AccountLimitTarget) => void;
}

const withCount = (label: string, items?: unknown[]) => (items ? `${label} (${items.length})` : label);

/**
 * The account detail page (presentational): header, actions, status banner and tabs.
 * Data, loading and error states come in as props; the route-level client wires queries and mutations.
 * For a non-ACTIVE account only the Overview tab exists, since Rucio hides the sub-resources.
 */
export const DetailsAccount = (props: DetailsAccountProps) => {
    const { info, isSelf, canManage, canLifecycle, identities, attributes, quotas, busy = false } = props;
    const isActive = info.accountStatus === AccountStatus.ACTIVE;
    const isAdmin = isActive && !!attributes.data?.some(a => a.key === 'admin' && isTruthyAttributeValue(a.value));

    const tabs: { id: AccountTab; label: string }[] = isActive
        ? [
              { id: 'overview', label: 'Overview' },
              { id: 'identities', label: withCount('Identities', identities.data) },
              { id: 'attributes', label: withCount('Attributes', attributes.data) },
              { id: 'quotas', label: 'Quotas and usage' },
          ]
        : [{ id: 'overview', label: 'Overview' }];
    const activeIndex = Math.max(
        tabs.findIndex(t => t.id === props.activeTab),
        0,
    );
    const activeTab = tabs[activeIndex].id;
    const statusMode = isActive ? 'suspend' : 'reactivate';

    return (
        <div className="flex flex-col space-y-6 w-full min-w-0">
            <header className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="overflow-x-auto">
                        <CopyableHeading text={info.account} />
                    </div>
                    <AccountTypeBadge value={info.accountType} />
                    <AccountStatusBadge value={info.accountStatus} />
                    {isAdmin && <Badge value="Admin" variant="success" />}
                    {isSelf && <Badge value="You" variant="info" />}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {info.email || 'No email'} · created <DateWithTooltip date={info.createdAt} />
                </p>
            </header>

            <DetailActions>
                {canManage && (
                    <Button variant="neutral" size="sm" onClick={props.onEdit} disabled={busy}>
                        <HiOutlinePencil className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Edit
                    </Button>
                )}
                {canManage && (
                    <Button variant={isActive ? 'neutral' : 'success'} size="sm" onClick={() => props.onSetStatus?.(statusMode)} disabled={busy}>
                        {isActive ? (
                            <HiOutlinePause className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        ) : (
                            <HiOutlinePlay className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        )}
                        {isActive ? 'Suspend' : 'Reactivate'}
                    </Button>
                )}
                <Link
                    href={`/rules?account=${encodeURIComponent(info.account)}&autoSearch=true`}
                    className={buttonVariants({ variant: 'neutral', size: 'sm' })}
                >
                    View rules
                    <HiOutlineExternalLink className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
                {canLifecycle && isActive && (
                    <Button variant="error" size="sm" className="ml-auto" onClick={props.onDelete} disabled={busy}>
                        <HiOutlineTrash className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Delete
                    </Button>
                )}
            </DetailActions>

            <AccountStatusBanner
                status={info.accountStatus}
                suspendedAt={info.suspendedAt}
                deletedAt={info.deletedAt}
                canReactivate={canManage}
                onReactivate={() => props.onSetStatus?.('reactivate')}
                busy={busy}
            />

            <TabSwitcher tabNames={tabs.map(t => t.label)} activeIndex={activeIndex} onSwitch={i => props.onTabChange(tabs[i].id)} />

            {activeTab === 'overview' && (
                <DetailsAccountOverview
                    info={info}
                    identitiesCount={identities.data?.length}
                    attributesCount={attributes.data?.length}
                    showTiles={isActive}
                    onOpenTab={props.onTabChange}
                />
            )}
            {activeTab === 'identities' && (
                <DetailsAccountIdentities
                    identities={identities}
                    canManage={canManage}
                    busy={busy}
                    onAdd={props.onAddIdentity}
                    onDelete={props.onDeleteIdentity}
                />
            )}
            {activeTab === 'attributes' && (
                <DetailsAccountAttributes
                    attributes={attributes}
                    canManage={canManage}
                    busy={busy}
                    onAdd={props.onAddAttribute}
                    onDelete={props.onDeleteAttribute}
                />
            )}
            {activeTab === 'quotas' && (
                <DetailsAccountQuotas
                    quotas={quotas}
                    canManage={canManage}
                    busy={busy}
                    onSetLimit={props.onSetLimit}
                    onDeleteLimit={props.onDeleteLimit}
                />
            )}
        </div>
    );
};

/** The page state when the account itself could not be loaded. */
export const DetailsAccountLoadError = ({ account, error, onRetry }: { account: string; error: AccountLoadError; onRetry?: () => void }) => {
    if (error.errorType === 'not_found') {
        return (
            <WarningField>
                <span>
                    The account <span className="font-mono">{account}</span> was not found.
                </span>
            </WarningField>
        );
    }
    const final = error.errorType === 'permission_denied';
    return (
        <WarningField>
            <span className="flex-1">{error.message || `Could not load the account ${account}.`}</span>
            {!final && onRetry && (
                <Button variant="neutral" size="sm" onClick={onRetry}>
                    Retry
                </Button>
            )}
        </WarningField>
    );
};
