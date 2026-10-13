import React from 'react';
import { HiPlus } from 'react-icons/hi';
import { Button } from '@/component-library/atoms/form/button';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { AccountAttribute } from '@/lib/core/entity/account';
import { AccountResource } from './details-account-types';
import { AccountResourceState } from './AccountResourceState';
import { AccountAttributesTable } from './AccountAttributesTable';

export interface DetailsAccountAttributesProps {
    attributes: AccountResource<AccountAttribute[]>;
    canManage: boolean;
    busy?: boolean;
    onAdd?: () => void;
    onDelete?: (attribute: AccountAttribute) => void;
}

export const DetailsAccountAttributes = ({ attributes, canManage, busy = false, onAdd, onDelete }: DetailsAccountAttributesProps) => (
    <div className="flex flex-col gap-4">
        {canManage && (
            <div className="flex justify-end">
                <Button size="sm" onClick={onAdd} disabled={busy}>
                    <HiPlus className="mr-1 h-4 w-4" aria-hidden="true" />
                    Add attribute
                </Button>
            </div>
        )}
        <AccountResourceState resource={attributes} label="attributes" />
        {attributes.data &&
            !attributes.error &&
            (attributes.data.length === 0 ? (
                <InfoField>
                    <span>No attributes.</span>
                </InfoField>
            ) : (
                <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden h-[28rem]">
                    <AccountAttributesTable attributes={attributes.data} canManage={canManage} onDelete={onDelete} busy={busy} />
                </div>
            ))}
    </div>
);
