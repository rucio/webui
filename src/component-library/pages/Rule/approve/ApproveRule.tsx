'use client';

import { useState } from 'react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { GridReadyEvent } from 'ag-grid-community';
import ApproveRuleTable from '@/component-library/pages/Rule/approve/ApproveRuleTable';
import { Button } from '@/component-library/atoms/form/button';
import { HiOutlineCheckCircle, HiOutlineBan } from 'react-icons/hi';
import { DenyRuleDialog } from '@/component-library/features/mutations/DenyRuleDialog';

export type ApproveRuleProps = {
    streamingHook: UseStreamReader<RuleViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    onApprove: (ruleId: string) => void;
    onDeny: (ruleId: string, comment?: string) => void;
    approvingRuleId: string | null;
    denyingRuleId: string | null;
};

export const ApproveRule = (props: ApproveRuleProps) => {
    const { streamingHook, onGridReady, onApprove, onDeny, approvingRuleId, denyingRuleId } = props;

    const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
    const [bulkDenyDialogOpen, setBulkDenyDialogOpen] = useState(false);

    const handleBulkApprove = () => {
        selectedRuleIds.forEach(id => onApprove(id));
    };

    const handleBulkDeny = () => {
        setBulkDenyDialogOpen(true);
    };

    const handleBulkDenyConfirm = (comment?: string) => {
        setBulkDenyDialogOpen(false);
        selectedRuleIds.forEach(id => onDeny(id, comment));
    };

    return (
        <div className="flex flex-col space-y-6 w-full">
            {/* Page header */}
            <header>
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Approval Queue</h1>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                    Review and approve or deny replication rules that are waiting for administrator approval.
                </p>
            </header>

            {/* Bulk deny confirmation dialog */}
            <DenyRuleDialog
                open={bulkDenyDialogOpen}
                onOpenChange={setBulkDenyDialogOpen}
                ruleId={`${selectedRuleIds.length} selected rule${selectedRuleIds.length !== 1 ? 's' : ''}`}
                onConfirm={handleBulkDenyConfirm}
            />

            {/* Bulk actions toolbar — visible only when rows are selected */}
            {selectedRuleIds.length > 0 && (
                <div className="flex items-center gap-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-3">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {selectedRuleIds.length} rule{selectedRuleIds.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2 ml-auto">
                        <Button variant="success" size="sm" onClick={handleBulkApprove}>
                            <HiOutlineCheckCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            Approve Selected
                        </Button>
                        <Button variant="error" size="sm" onClick={handleBulkDeny}>
                            <HiOutlineBan className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            Deny Selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Rules table */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-24rem)]">
                <ApproveRuleTable
                    streamingHook={streamingHook}
                    onGridReady={onGridReady}
                    onApprove={onApprove}
                    onDeny={onDeny}
                    approvingRuleId={approvingRuleId}
                    denyingRuleId={denyingRuleId}
                    onSelectionChanged={setSelectedRuleIds}
                />
            </div>
        </div>
    );
};
