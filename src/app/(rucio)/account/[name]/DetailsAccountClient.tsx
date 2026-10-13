'use client';

import React, { useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { DetailsAccount, DetailsAccountLoadError } from '@/component-library/pages/Account/details/DetailsAccount';
import { fetchViewModel, sendMutation } from '@/component-library/pages/Account/account-fetch';
import {
    AccountLimitTarget,
    AccountLoadError,
    AccountQuotas,
    AccountResource,
    AccountTab,
    isAccountTab,
} from '@/component-library/pages/Account/details/details-account-types';
import {
    AddIdentityDialog,
    AddIdentityValues,
    DeleteAccountDialog,
    DeleteAccountLimitDialog,
    DeleteIdentityDialog,
    EditAccountDialog,
    EditAccountValues,
    SetAccountLimitDialog,
    SetAccountLimitValues,
    SetAccountStatusDialog,
    SetAccountStatusValues,
} from '@/component-library/features/mutations/account';
import { AddAccountAttributeDialog } from '@/component-library/features/mutations/account-attributes/AddAccountAttributeDialog';
import { EditAccountAttributeDialog } from '@/component-library/features/mutations/account-attributes/EditAccountAttributeDialog';
import { DeleteAccountAttributeDialog } from '@/component-library/features/mutations/account-attributes/DeleteAccountAttributeDialog';
import { useFeature } from '@/component-library/features/feature-flags/FeatureProvider';
import { usePermissions } from '@/lib/infrastructure/hooks/usePermissions';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { accountKeys, accountQueryDefaults, invalidateForMutation, QUERY_KEYS } from '@/lib/infrastructure/query';
import { AccountStatus } from '@/lib/core/entity/rucio';
import { AccountAttribute, AccountIdentity } from '@/lib/core/entity/account';
import { isValidAccountAttribute, toAttributeValueString } from '@/lib/core/utils/account-validation';
import {
    AccountAttributesViewModel,
    AccountIdentitiesViewModel,
    AccountInfoViewModel,
    AccountMutationViewModel,
    AccountQuotasViewModel,
} from '@/lib/infrastructure/data/view-model/account';

/** RSE names for the quota dialog's RSE select, read from the streaming list-rses endpoint (NDJSON). */
const fetchRseNames = async (): Promise<string[]> => {
    const res = await fetch('/api/feature/list-rses?rseExpression=*');
    if (!res.ok) throw { status: 'error', errorType: 'unknown', message: res.statusText };
    const names: string[] = [];
    for (const line of (await res.text()).split('\n')) {
        if (!line.trim()) continue;
        try {
            const vm = JSON.parse(line);
            if (vm.status === 'success' && vm.name) names.push(vm.name);
        } catch {
            // skip a malformed line
        }
    }
    return names.sort();
};

const ATTRIBUTE_RULE = 'Use up to 30 letters, digits, and - _ \\ / . characters';
const validateAttribute = (s: string) => (isValidAccountAttribute(s) ? undefined : ATTRIBUTE_RULE);
const ROLE_NOTE = "Role changes apply after the account's next login.";

type DialogState =
    | { kind: 'edit' }
    | { kind: 'status'; mode: 'suspend' | 'reactivate' }
    | { kind: 'delete' }
    | { kind: 'add-identity' }
    | { kind: 'delete-identity'; identity: AccountIdentity }
    | { kind: 'add-attribute' }
    | { kind: 'edit-attribute'; attribute: AccountAttribute }
    | { kind: 'delete-attribute'; attribute: AccountAttribute }
    | { kind: 'set-limit'; initial?: SetAccountLimitValues }
    | { kind: 'delete-limit'; target: AccountLimitTarget };

export interface DetailsAccountClientProps {
    account: string;
    /** The account of the signed-in user. */
    sessionAccount: string;
    /** Account info prefetched on the server, so the status is known at hydration. */
    initialInfo?: AccountInfoViewModel;
    initialInfoUpdatedAt?: number;
}

/**
 * Route-level client for /account/[name]: queries, mutations, dialogs and the `?tab=` URL state.
 * Rendering is done by the presentational DetailsAccount.
 */
export const DetailsAccountClient = ({ account, sessionAccount, initialInfo, initialInfoUpdatedAt }: DetailsAccountClientProps) => {
    const router = useRouter();
    const pathname = usePathname() ?? `/account/${encodeURIComponent(account)}`;
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { data: session, update: updateSession } = useSession();
    const { check } = usePermissions();
    const manageEnabled = useFeature('accounts.manage');
    const canManage = check('account', 'manage', { account }) && manageEnabled;
    const canLifecycle = check('account', 'lifecycle') && manageEnabled;
    const encoded = encodeURIComponent(account);

    // Tab state: initialised from ?tab=, mirrored to the URL on every switch.
    const urlTab = searchParams?.get('tab');
    const [tab, setTab] = useState<AccountTab>(isAccountTab(urlTab) ? urlTab : 'overview');
    // Once true it stays true, so going back to another tab does not disable the quotas query.
    const quotasTabVisited = useRef(tab === 'quotas');
    const onTabChange = (next: AccountTab) => {
        if (next === 'quotas') quotasTabVisited.current = true;
        setTab(next);
        router.replace(next === 'overview' ? pathname : `${pathname}?tab=${next}`);
    };

    // Set first thing after a successful delete: removeQueries drops queries that still have mounted
    // observers, and the re-render before navigation would recreate and refetch them.
    const [deleted, setDeleted] = useState(false);

    // A failed server prefetch is not used as data: the client query then fetches and shows the error.
    const initialData = initialInfo?.status === 'success' && !deleted ? initialInfo : undefined;
    const infoQuery = useQuery<AccountInfoViewModel, AccountLoadError>({
        queryKey: accountKeys.info(account),
        queryFn: () => fetchViewModel<AccountInfoViewModel>(`/api/feature/get-account-info?account=${encoded}`),
        initialData,
        initialDataUpdatedAt: initialData ? initialInfoUpdatedAt : undefined,
        enabled: !deleted,
        ...accountQueryDefaults,
    });
    const info = infoQuery.data;
    const isActive = !deleted && info?.accountStatus === AccountStatus.ACTIVE;

    const identitiesQuery = useQuery<AccountIdentity[], AccountLoadError>({
        queryKey: accountKeys.identities(account),
        queryFn: async () => (await fetchViewModel<AccountIdentitiesViewModel>(`/api/feature/list-account-identities?account=${encoded}`)).identities,
        enabled: isActive,
        ...accountQueryDefaults,
    });
    const attributesQuery = useQuery<AccountAttribute[], AccountLoadError>({
        queryKey: accountKeys.attributes(account),
        queryFn: async () => (await fetchViewModel<AccountAttributesViewModel>(`/api/feature/list-account-attributes?account=${encoded}`)).attributes,
        enabled: isActive,
        ...accountQueryDefaults,
    });
    const quotasQuery = useQuery<AccountQuotas, AccountLoadError>({
        queryKey: accountKeys.quotas(account),
        queryFn: async () => {
            const { local, global } = await fetchViewModel<AccountQuotasViewModel>(`/api/feature/get-account-quotas?account=${encoded}`);
            return { local, global };
        },
        enabled: isActive && quotasTabVisited.current,
        ...accountQueryDefaults,
    });

    // Dialogs: one open at a time. `dialog` outlives `open` so a closing dialog keeps its content.
    const [dialog, setDialog] = useState<DialogState | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogError, setDialogError] = useState<string | undefined>();
    const openDialog = (next: DialogState) => {
        setDialogError(undefined);
        setDialog(next);
        setDialogOpen(true);
    };
    const closeDialog = () => setDialogOpen(false);
    // A resubmit must not show the error of the previous attempt.
    const clearDialogError = () => setDialogError(undefined);
    const isOpen = (kind: DialogState['kind']) => dialogOpen && dialog?.kind === kind;

    const rseNamesQuery = useQuery<string[]>({
        queryKey: [...QUERY_KEYS.RSE_NAMES],
        queryFn: fetchRseNames,
        enabled: isOpen('set-limit'),
        staleTime: 5 * 60_000,
        retry: false,
    });

    const onMutationError = (vm: AccountMutationViewModel) => {
        setDialogError(vm?.message || 'The Rucio server rejected the request.');
        // A stale admin role in the session corrects itself.
        if (vm?.errorType === 'permission_denied') void updateSession();
    };
    const succeed = (mutation: string, vars: unknown, title: string, description?: string) => {
        invalidateForMutation(queryClient, mutation, vars);
        toast({ variant: 'success', title, description });
        closeDialog();
    };
    // The session's role is resolved at login; refresh it when the admin attribute of the session account changes.
    const afterAdminChange = (key: string) => {
        if (key === 'admin' && account === sessionAccount) void updateSession();
    };

    const editMutation = useMutation({
        mutationFn: (vars: { account: string; options: EditAccountValues }) => sendMutation('update-account', 'PUT', vars),
        onSuccess: (_, vars) => succeed('update-account', vars, 'Account updated'),
        onMutate: clearDialogError,
        onError: onMutationError,
    });
    const statusMutation = useMutation({
        mutationFn: (vars: { account: string; options: SetAccountStatusValues }) => sendMutation('update-account', 'PUT', vars),
        onSuccess: async (_, vars) => {
            if (vars.options.status !== AccountStatus.SUSPENDED) {
                succeed('update-account', vars, 'Account reactivated');
                return;
            }
            // Suspend: wait for the refreshed info first. Its new status disables the identity, attribute
            // and quota queries, which can then be dropped without a refetch (Rucio answers 404 for the
            // sub-resources of a suspended account). Reactivate invalidates the whole account instead.
            await invalidateForMutation(queryClient, 'update-account', vars);
            [accountKeys.identities(account), accountKeys.attributes(account), accountKeys.quotas(account)].forEach(queryKey =>
                queryClient.removeQueries({ queryKey }),
            );
            toast({ variant: 'success', title: 'Account suspended' });
            closeDialog();
        },
        onMutate: clearDialogError,
        onError: onMutationError,
    });
    const deleteMutation = useMutation({
        mutationFn: (vars: { account: string }) => sendMutation('delete-account', 'DELETE', vars),
        onSuccess: () => {
            // Disable every account query before removing them, so nothing refetches the deleted account.
            setDeleted(true);
            // Remove rather than invalidate: no refetch of the deleted account and no flash of 404.
            queryClient.removeQueries({ queryKey: accountKeys.detail(account) });
            router.push('/accounts');
            closeDialog();
            toast({ variant: 'success', title: 'Account deleted' });
        },
        onMutate: clearDialogError,
        onError: onMutationError,
    });
    // The variables can hold a password: never keep them in the mutation cache (gcTime 0) and reset
    // the mutation on success and on close.
    const addIdentityMutation: UseMutationResult<AccountMutationViewModel, AccountMutationViewModel, AddIdentityValues & { account: string }> =
        useMutation({
            mutationFn: (vars: AddIdentityValues & { account: string }) => sendMutation('add-account-identity', 'POST', vars),
            gcTime: 0,
            onMutate: clearDialogError,
            onSuccess: (_, vars) => {
                succeed('add-account-identity', { account: vars.account }, 'Identity added');
                addIdentityMutation.reset();
            },
            onError: onMutationError,
        });
    const deleteIdentityMutation = useMutation({
        mutationFn: (vars: { account: string; identity: string; authType: string }) => sendMutation('delete-account-identity', 'DELETE', vars),
        onSuccess: (_, vars) => succeed('delete-account-identity', vars, 'Identity removed'),
        onMutate: clearDialogError,
        onError: onMutationError,
    });
    const addAttributeMutation = useMutation({
        mutationFn: (vars: { account: string; key: string; value: string }) => sendMutation('add-account-attribute', 'POST', vars),
        onSuccess: (_, vars) => {
            succeed('add-account-attribute', vars, 'Attribute added', vars.key === 'admin' ? ROLE_NOTE : undefined);
            afterAdminChange(vars.key);
        },
        onMutate: clearDialogError,
        onError: onMutationError,
    });
    const updateAttributeMutation = useMutation({
        mutationFn: (vars: { account: string; key: string; value: string }) => sendMutation('update-account-attribute', 'PUT', vars),
        onSuccess: (_, vars) => {
            succeed('update-account-attribute', vars, 'Attribute updated', vars.key === 'admin' ? ROLE_NOTE : undefined);
            afterAdminChange(vars.key);
        },
        onMutate: clearDialogError,
        onError: (vm, vars) => {
            onMutationError(vm as unknown as AccountMutationViewModel);
            // The delete may have succeeded even though the update failed: refresh the list and the role.
            void invalidateForMutation(queryClient, 'update-account-attribute', vars);
            afterAdminChange(vars.key);
        },
    });
    const deleteAttributeMutation = useMutation({
        mutationFn: (vars: { account: string; key: string }) => sendMutation('delete-account-attribute', 'DELETE', vars),
        onSuccess: (_, vars) => {
            succeed('delete-account-attribute', vars, 'Attribute deleted', vars.key === 'admin' ? ROLE_NOTE : undefined);
            afterAdminChange(vars.key);
        },
        onMutate: clearDialogError,
        onError: onMutationError,
    });
    const setLimitMutation = useMutation({
        mutationFn: (vars: SetAccountLimitValues & { account: string }) => sendMutation('set-account-limit', 'PUT', vars),
        onSuccess: (_, vars) => succeed('set-account-limit', vars, 'Quota saved'),
        onMutate: clearDialogError,
        onError: onMutationError,
    });
    const deleteLimitMutation = useMutation({
        mutationFn: (vars: AccountLimitTarget & { account: string }) => sendMutation('delete-account-limit', 'DELETE', vars),
        onSuccess: (_, vars) => succeed('delete-account-limit', vars, 'Quota removed'),
        onMutate: clearDialogError,
        onError: onMutationError,
    });

    const busy = [
        editMutation,
        statusMutation,
        deleteMutation,
        addIdentityMutation,
        deleteIdentityMutation,
        addAttributeMutation,
        updateAttributeMutation,
        deleteAttributeMutation,
        setLimitMutation,
        deleteLimitMutation,
    ].some(m => m.isPending);

    if (deleted) {
        return <p className="py-6 text-sm text-neutral-600 dark:text-neutral-400">Account deleted. Returning to the accounts list...</p>;
    }

    if (!info) {
        if (infoQuery.error) return <DetailsAccountLoadError account={account} error={infoQuery.error} onRetry={() => infoQuery.refetch()} />;
        return (
            <div className="flex items-center gap-2 py-6 text-sm text-neutral-600 dark:text-neutral-400">
                <LoadingSpinner size="sm" aria-hidden="true" />
                <span>Loading account...</span>
            </div>
        );
    }

    const resource = <T,>(query: { data?: T; isLoading: boolean; error: AccountLoadError | null; refetch: () => unknown }): AccountResource<T> => ({
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
        onRetry: () => void query.refetch(),
    });
    const onSetOpenChange = (open: boolean) => (open ? setDialogOpen(true) : closeDialog());
    const roleNote = <Alert variant="warning" message={ROLE_NOTE} />;
    const identities = identitiesQuery.data ?? [];
    const sessionIdentity = session?.user?.rucioIdentity;

    return (
        <>
            <DetailsAccount
                info={info}
                isSelf={account === sessionAccount}
                canManage={canManage}
                canLifecycle={canLifecycle}
                activeTab={tab}
                onTabChange={onTabChange}
                identities={resource(identitiesQuery)}
                attributes={resource(attributesQuery)}
                quotas={resource(quotasQuery)}
                busy={busy}
                onEdit={() => openDialog({ kind: 'edit' })}
                onSetStatus={mode => openDialog({ kind: 'status', mode })}
                onDelete={() => openDialog({ kind: 'delete' })}
                onAddIdentity={() => openDialog({ kind: 'add-identity' })}
                onDeleteIdentity={identity => openDialog({ kind: 'delete-identity', identity })}
                onAddAttribute={() => openDialog({ kind: 'add-attribute' })}
                onEditAttribute={attribute => openDialog({ kind: 'edit-attribute', attribute })}
                onDeleteAttribute={attribute => openDialog({ kind: 'delete-attribute', attribute })}
                onSetLimit={initial => openDialog({ kind: 'set-limit', initial })}
                onDeleteLimit={target => openDialog({ kind: 'delete-limit', target })}
            />

            {canManage && (
                <>
                    <EditAccountDialog
                        open={isOpen('edit')}
                        onOpenChange={onSetOpenChange}
                        account={account}
                        initial={{ accountType: info.accountType, email: info.email || null }}
                        onSubmit={options => editMutation.mutate({ account, options })}
                        loading={editMutation.isPending}
                        error={dialogError}
                    />
                    <SetAccountStatusDialog
                        open={isOpen('status')}
                        onOpenChange={onSetOpenChange}
                        account={account}
                        mode={dialog?.kind === 'status' ? dialog.mode : 'suspend'}
                        onSubmit={options => statusMutation.mutate({ account, options })}
                        loading={statusMutation.isPending}
                        error={dialogError}
                    />
                    <AddIdentityDialog
                        open={isOpen('add-identity')}
                        onOpenChange={open => {
                            onSetOpenChange(open);
                            if (!open) addIdentityMutation.reset();
                        }}
                        account={account}
                        onSubmit={values => addIdentityMutation.mutate({ account, ...values })}
                        loading={addIdentityMutation.isPending}
                        error={dialogError}
                    />
                    {dialog?.kind === 'delete-identity' && (
                        <DeleteIdentityDialog
                            open={dialogOpen}
                            onOpenChange={onSetOpenChange}
                            account={account}
                            identity={dialog.identity.identity}
                            authType={dialog.identity.type}
                            isLastIdentity={identities.length === 1}
                            isCurrentSessionIdentity={account === sessionAccount && dialog.identity.identity === sessionIdentity}
                            onSubmit={values => deleteIdentityMutation.mutate({ account, ...values })}
                            loading={deleteIdentityMutation.isPending}
                            error={dialogError}
                        />
                    )}
                    <AddAccountAttributeDialog
                        open={isOpen('add-attribute')}
                        onOpenChange={onSetOpenChange}
                        entityName={account}
                        existingKeys={attributesQuery.data?.map(a => a.key)}
                        validateKey={validateAttribute}
                        validateValue={validateAttribute}
                        warning={({ key }) => (key === 'admin' ? roleNote : null)}
                        keyPlaceholder="e.g., country"
                        valuePlaceholder="e.g., CH"
                        onConfirm={(key, value) => addAttributeMutation.mutate({ account, key, value })}
                        loading={addAttributeMutation.isPending}
                        error={dialogError}
                    />
                    {dialog?.kind === 'edit-attribute' && (
                        <EditAccountAttributeDialog
                            open={dialogOpen}
                            onOpenChange={onSetOpenChange}
                            entityName={account}
                            attributeKey={dialog.attribute.key}
                            currentValue={toAttributeValueString(dialog.attribute.value)}
                            validateValue={validateAttribute}
                            warning={dialog.attribute.key === 'admin' ? roleNote : undefined}
                            onConfirm={value => updateAttributeMutation.mutate({ account, key: dialog.attribute.key, value })}
                            loading={updateAttributeMutation.isPending}
                            error={dialogError}
                        />
                    )}
                    {dialog?.kind === 'delete-attribute' && (
                        <DeleteAccountAttributeDialog
                            open={dialogOpen}
                            onOpenChange={onSetOpenChange}
                            entityName={account}
                            attributeKey={dialog.attribute.key}
                            attributeValue={toAttributeValueString(dialog.attribute.value)}
                            warning={dialog.attribute.key === 'admin' ? roleNote : undefined}
                            onConfirm={() => deleteAttributeMutation.mutate({ account, key: dialog.attribute.key })}
                            loading={deleteAttributeMutation.isPending}
                            error={dialogError}
                        />
                    )}
                    <SetAccountLimitDialog
                        open={isOpen('set-limit')}
                        onOpenChange={onSetOpenChange}
                        account={account}
                        rses={rseNamesQuery.data ?? []}
                        rsesLoading={rseNamesQuery.isLoading}
                        rsesError={
                            rseNamesQuery.isError
                                ? 'Could not load the RSE list. Try again later, or set a global limit with an RSE expression.'
                                : undefined
                        }
                        initial={dialog?.kind === 'set-limit' ? dialog.initial : undefined}
                        onSubmit={values => setLimitMutation.mutate({ account, ...values })}
                        loading={setLimitMutation.isPending}
                        error={dialogError}
                    />
                    {dialog?.kind === 'delete-limit' && (
                        <DeleteAccountLimitDialog
                            open={dialogOpen}
                            onOpenChange={onSetOpenChange}
                            account={account}
                            locality={dialog.target.locality}
                            rseExpression={dialog.target.rseExpression}
                            onSubmit={values => deleteLimitMutation.mutate({ account, ...values })}
                            loading={deleteLimitMutation.isPending}
                            error={dialogError}
                        />
                    )}
                </>
            )}
            {canLifecycle && (
                <DeleteAccountDialog
                    open={isOpen('delete')}
                    onOpenChange={onSetOpenChange}
                    account={account}
                    onSubmit={vars => deleteMutation.mutate(vars)}
                    loading={deleteMutation.isPending}
                    error={dialogError}
                />
            )}
        </>
    );
};
