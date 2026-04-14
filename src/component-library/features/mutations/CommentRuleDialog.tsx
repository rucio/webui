'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Textarea } from '@/component-library/atoms/form/input';
import { HiInformationCircle } from 'react-icons/hi';

export interface CommentRuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    onConfirm: (comment: string) => void;
    loading?: boolean;
    /** Pre-populate the comment field when the dialog opens. */
    initialComment?: string;
    /** Whether the current user is an admin. Non-admins see a policy warning. */
    isAdmin?: boolean;
}

/**
 * Dialog for adding a comment to a replication rule.
 * Accepts a non-empty text comment that is attached to the rule.
 *
 * @example
 * ```tsx
 * <CommentRuleDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     ruleId="abc123def456"
 *     onConfirm={(comment) => handleComment(comment)}
 * />
 * ```
 */
export const CommentRuleDialog: React.FC<CommentRuleDialogProps> = ({ open, onOpenChange, ruleId, onConfirm, loading = false, initialComment = '', isAdmin = false }) => {
    const [comment, setComment] = useState('');
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (open) {
            setComment(initialComment);
            setError(undefined);
        }
    }, [open, initialComment]);

    const handleSubmit = () => {
        const trimmed = comment.trim();
        if (!trimmed) {
            setError('Comment cannot be empty');
            return;
        }
        setError(undefined);
        onConfirm(trimmed);
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Add Comment"
            description="Attach a note to this replication rule."
            onSubmit={handleSubmit}
            submitLabel="Add Comment"
            submitVariant="default"
            loading={loading}
            disabled={!comment.trim()}
        >
            <div className="space-y-4">
                {/* Tips */}
                <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 p-3 text-sm text-base-info-700 dark:text-base-info-200 flex gap-2 items-start">
                    <HiInformationCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <p>
                        Tips: Adding a comment attaches a note to this replication rule. Comments are visible to all users who can view the rule and
                        help communicate the purpose or status of a rule.
                    </p>
                </div>

                {/* Policy warning for non-admins */}
                {!isAdmin && (
                    <div className="flex items-start gap-3 rounded-md bg-base-warning-50 dark:bg-base-warning-950 border border-base-warning-200 dark:border-base-warning-800 p-3">
                        <HiInformationCircle className="h-5 w-5 shrink-0 text-base-warning-600 dark:text-base-warning-400 mt-0.5" aria-hidden="true" />
                        <p className="text-sm text-base-warning-900 dark:text-base-warning-100">
                            The server may reject this request depending on the policy configured by your administrator.
                        </p>
                    </div>
                )}

                {/* Rule ID */}
                <div>
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Rule ID</span>
                    <p className="mt-1 font-mono text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1.5 break-all">
                        {ruleId}
                    </p>
                </div>

                {/* Comment textarea */}
                <div>
                    <label htmlFor="rule-comment" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        Comment <span className="text-base-error-600">*</span>
                    </label>
                    <Textarea
                        id="rule-comment"
                        value={comment}
                        onChange={e => {
                            setComment(e.target.value);
                            if (error) setError(undefined);
                        }}
                        placeholder="Enter your comment here..."
                        error={!!error}
                        aria-describedby={error ? 'rule-comment-error' : undefined}
                    />
                    {error && (
                        <p id="rule-comment-error" className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </MutationDialog>
    );
};
