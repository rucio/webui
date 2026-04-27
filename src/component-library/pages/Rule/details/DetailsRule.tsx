'use client';

import { CopyableHeading, Heading } from '@/component-library/atoms/misc/Heading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { LoadingPage } from '@/component-library/pages/system/LoadingPage';
import { TabSwitcher } from '@/component-library/features/tabs/TabSwitcher';
import { useState } from 'react';
import { RuleMetaViewModel, UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { cn } from '@/component-library/utils';
import { DetailsRuleLocks } from '@/component-library/pages/Rule/details/DetailsRuleLocks';
import { DetailsRuleMeta } from '@/component-library/pages/Rule/details/DetailsRuleMeta';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { DetailActions } from '@/component-library/features/mutations/DetailActions';
import { Button } from '@/component-library/atoms/form/button';
import {
    HiOutlineLightningBolt,
    HiInformationCircle,
    HiChevronDown,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineBan,
    HiOutlineTrash,
    HiOutlineAnnotation,
} from 'react-icons/hi';
import { QUERY_KEYS, invalidateForMutation } from '@/lib/infrastructure/query';
import { RuleState } from '@/lib/core/entity/rucio';
import { UpdateLifetimeDialog } from '@/component-library/features/mutations/UpdateLifetimeDialog';
import { ApproveRuleDialog } from '@/component-library/features/mutations/ApproveRuleDialog';
import { CommentRuleDialog } from '@/component-library/features/mutations/CommentRuleDialog';
import { DenyRuleDialog } from '@/component-library/features/mutations/DenyRuleDialog';
import { DeleteRuleDialog } from '@/component-library/features/mutations/DeleteRuleDialog';
import { usePermissions } from '@/lib/infrastructure/hooks/usePermissions';

export const DetailsRuleTabs = ({ id, meta }: { id: string; meta: RuleMetaViewModel }) => {
    const tabNames = ['Attributes', 'Locks'];
    const [activeIndex, setActiveIndex] = useState(0);

    const getViewClasses = (index: number) => {
        const visibilityClass = index === activeIndex ? 'flex' : 'hidden';
        return cn('flex-col grow', visibilityClass);
    };

    return (
        <>
            <TabSwitcher tabNames={tabNames} onSwitch={setActiveIndex} activeIndex={activeIndex} />
            <div className={getViewClasses(0)}>
                <DetailsRuleMeta meta={meta} />
            </div>
            <div className={getViewClasses(1)}>
                <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-20rem)]">
                    <DetailsRuleLocks id={id} isActive={1 === activeIndex} />
                </div>
            </div>
        </>
    );
};

export const DetailsRule = ({ id }: { id: string }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const validator = new BaseViewModelValidator(toast);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
    const { check, isReady } = usePermissions();

    const [isTipsOpen, setIsTipsOpen] = useState(false);
    const [isLifetimeOpen, setIsLifetimeOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [isDenyOpen, setIsDenyOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { mutate: boostRule, isPending: isBoosting } = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId: id, options: { priority: 5 } }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: viewModel => {
            toast({ variant: 'success', title: 'Rule Boosted', description: viewModel.message || 'Priority set to 5.' });
            invalidateForMutation(queryClient, 'update-rule');
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Boost Failed', description: error.message || 'Failed to boost rule.' });
        },
    });

    const updateLifetimeMutation = useMutation({
        mutationFn: async (lifetimeSeconds: number | null) => {
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId: id, options: { lifetime: lifetimeSeconds } }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            invalidateForMutation(queryClient, 'update-rule');
            setIsLifetimeOpen(false);
            toast({ variant: 'success', title: 'Lifetime updated' });
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Failed to update lifetime', description: error.message || 'Failed to update lifetime.' });
        },
    });

    const approveRuleMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId: id, options: { approve: true } }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            invalidateForMutation(queryClient, 'update-rule');
            setIsApproveOpen(false);
            toast({ variant: 'success', title: 'Rule approved' });
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Failed to approve rule', description: error.message || 'Failed to approve rule.' });
        },
    });

    const denyRuleMutation = useMutation({
        mutationFn: async (comment?: string) => {
            const options: Record<string, unknown> = { approve: false };
            if (comment) options.comment = comment;
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId: id, options }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            invalidateForMutation(queryClient, 'update-rule');
            setIsDenyOpen(false);
            toast({ variant: 'success', title: 'Rule denied' });
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Failed to deny rule', description: error.message || 'Failed to deny rule.' });
        },
    });

    const deleteRuleMutation = useMutation({
        mutationFn: async (forceDelete: boolean) => {
            const lifetimeSeconds = forceDelete ? 0 : 3600;
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId: id, options: { lifetime: lifetimeSeconds } }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            invalidateForMutation(queryClient, 'update-rule');
            setIsDeleteOpen(false);
            toast({ variant: 'success', title: 'Rule scheduled for deletion' });
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Failed to delete rule', description: error.message || 'Failed to delete rule.' });
        },
    });

    const commentRuleMutation = useMutation({
        mutationFn: async (comment: string) => {
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId: id, options: { comment } }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            invalidateForMutation(queryClient, 'update-rule');
            setIsCommentOpen(false);
            toast({ variant: 'success', title: 'Comment added' });
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Failed to add comment', description: error.message || 'Failed to add comment.' });
        },
    });

    const queryMeta = async () => {
        const url = '/api/feature/get-rule?' + new URLSearchParams({ id });

        setFetchErrorMessage(null); // Clear any previous errors
        const res = await fetch(url);
        if (!res.ok) {
            let errorMsg = res.statusText;
            try {
                const json = await res.json();
                errorMsg = json.message || errorMsg;
            } catch (e) {}
            setFetchErrorMessage(errorMsg);
            throw new Error(errorMsg);
        }

        const json = await res.json();
        if (validator.isValid(json)) return json;

        return null;
    };

    const metaQueryKey = [...QUERY_KEYS.RULE_META];
    const {
        data: meta,
        error: metaError,
        isLoading: isMetaLoading,
        refetch,
    } = useQuery<RuleMetaViewModel>({
        queryKey: metaQueryKey,
        queryFn: queryMeta,
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (metaError) {
        return (
            <div className="w-full p-6">
                <Alert
                    variant="error"
                    message={`Failed to load rule ${id}. ${fetchErrorMessage || 'Please try again.'}`}
                    onClose={() => {
                        setFetchErrorMessage(null);
                        refetch();
                    }}
                />
            </div>
        );
    }

    if (isMetaLoading || !meta) {
        return <LoadingPage message="Loading rule details..." />;
    }

    const userCanUpdateRule = isReady ? check('rule', 'update', { account: meta.account }) : false;
    const userCanApproveRule = isReady ? check('rule', 'approve') : false;
    const userCanSetInfiniteLifetime = isReady ? check('rule', 'set_infinite_lifetime') : false;

    return (
        <div className="flex flex-col space-y-6 w-full min-w-0">
            <header className="mb-2">
                <div className="overflow-y-hidden overflow-x-auto whitespace-nowrap">
                    <CopyableHeading text={id} />
                </div>
            </header>
            <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 text-sm text-base-info-700 dark:text-base-info-200">
                <button
                    type="button"
                    className="flex w-full items-center gap-2 p-3 text-left"
                    onClick={() => setIsTipsOpen(prev => !prev)}
                    aria-expanded={isTipsOpen}
                >
                    <HiInformationCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="font-medium flex-1">Rule Actions</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isTipsOpen && 'rotate-180')}
                        aria-hidden="true"
                    />
                </button>
                {isTipsOpen && (
                    <ul className="list-disc list-inside space-y-0.5 px-3 pb-3 pl-10">
                        {userCanApproveRule && (
                            <li>
                                <span className="font-medium">Boost Rule:</span> Immediately sets the rule priority to maximum (5) to accelerate
                                transfers.
                            </li>
                        )}
                        {userCanApproveRule && meta.state === RuleState.WAITING_APPROVAL && (
                            <li>
                                <span className="font-medium">Approve Rule:</span> Approve this rule to begin active replication.
                            </li>
                        )}
                        {userCanApproveRule && meta.state === RuleState.WAITING_APPROVAL && (
                            <li>
                                <span className="font-medium">Deny Rule:</span> Reject this rule. You may optionally provide a reason for the denial.
                            </li>
                        )}
                        <li>
                            <span className="font-medium">Update Lifetime:</span> Set or clear when this rule expires.
                            {!userCanApproveRule && ' The server may reject this request depending on the policy.'}
                        </li>
                        <li>
                            <span className="font-medium">Add Comment:</span> Attach a note to this rule.
                            {!userCanApproveRule && ' The server may reject this request depending on the policy.'}
                        </li>
                        <li>
                            <span className="font-medium">Delete Rule:</span> Schedule this rule for deletion by setting the lifetime to 1 hour.
                            {userCanApproveRule && ' Admins may also force-delete to set lifetime to 0 for immediate deletion.'}
                            {!userCanApproveRule && ' The server may reject this request depending on the policy.'}
                        </li>
                    </ul>
                )}
            </div>
            <DetailActions>
                {userCanApproveRule && (
                    <Button variant="default" size="sm" loading={isBoosting} onClick={() => boostRule()}>
                        <HiOutlineLightningBolt className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Boost Rule
                    </Button>
                )}
                {userCanApproveRule && meta.state === RuleState.WAITING_APPROVAL && (
                    <Button variant="success" size="sm" onClick={() => setIsApproveOpen(true)}>
                        <HiOutlineCheckCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Approve Rule
                    </Button>
                )}
                {userCanApproveRule && meta.state === RuleState.WAITING_APPROVAL && (
                    <Button variant="error" size="sm" onClick={() => setIsDenyOpen(true)}>
                        <HiOutlineBan className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Deny Rule
                    </Button>
                )}
                {userCanUpdateRule && (
                    <Button variant="neutral" size="sm" onClick={() => setIsLifetimeOpen(true)}>
                        <HiOutlineClock className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Update Lifetime
                    </Button>
                )}
                {userCanUpdateRule && (
                    <Button variant="neutral" size="sm" onClick={() => setIsCommentOpen(true)}>
                        <HiOutlineAnnotation className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Add Comment
                    </Button>
                )}
                {userCanUpdateRule && (
                    <Button variant="error" size="sm" onClick={() => setIsDeleteOpen(true)}>
                        <HiOutlineTrash className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Delete Rule
                    </Button>
                )}
            </DetailActions>
            <DetailsRuleTabs id={id} meta={meta} />
            <UpdateLifetimeDialog
                open={isLifetimeOpen}
                onOpenChange={setIsLifetimeOpen}
                ruleId={id}
                currentExpiresAt={meta.expires_at}
                onConfirm={lifetimeSeconds => updateLifetimeMutation.mutate(lifetimeSeconds)}
                loading={updateLifetimeMutation.isPending}
                canSetInfinite
                maxLifetimeSeconds={userCanSetInfiniteLifetime ? undefined : 365 * 86400}
                minLifetimeSeconds={userCanSetInfiniteLifetime ? 0 : 24 * 3600}
                isAdmin={userCanApproveRule}
            />
            <ApproveRuleDialog
                open={isApproveOpen}
                onOpenChange={setIsApproveOpen}
                ruleId={id}
                onConfirm={() => approveRuleMutation.mutate()}
                loading={approveRuleMutation.isPending}
            />
            <DenyRuleDialog
                open={isDenyOpen}
                onOpenChange={setIsDenyOpen}
                ruleId={id}
                onConfirm={comment => denyRuleMutation.mutate(comment)}
                loading={denyRuleMutation.isPending}
            />
            <DeleteRuleDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                ruleId={id}
                onConfirm={forceDelete => deleteRuleMutation.mutate(forceDelete)}
                loading={deleteRuleMutation.isPending}
            />
            <CommentRuleDialog
                open={isCommentOpen}
                onOpenChange={setIsCommentOpen}
                ruleId={id}
                onConfirm={comment => commentRuleMutation.mutate(comment)}
                loading={commentRuleMutation.isPending}
                isAdmin={userCanApproveRule}
            />
        </div>
    );
};
