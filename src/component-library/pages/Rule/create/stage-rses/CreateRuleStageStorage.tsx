import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { CreateRuleParameters, CreateRuleStorage } from '@/lib/infrastructure/data/view-model/rule';
import { cn } from '@/component-library/utils';
import { HintLink } from '@/component-library/atoms/misc/HintLink';
import { Input } from '@/component-library/atoms/form/input';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { ChangeEvent, useEffect, useState } from 'react';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { CreateRuleStageStorageTable } from '@/component-library/pages/Rule/create/stage-rses/CreateRuleStageStorageTable';
import { GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { WarningField } from '@/component-library/features/fields/WarningField';
import Checkbox from '@/component-library/atoms/form/Checkbox';
import { CreateRuleTableWrapper } from '@/component-library/pages/Rule/create/CreateRuleTableWrapper';
import { LabeledCheckbox } from '@/component-library/features/form/LabeledCheckbox';
import { RSESearchPanel } from '@/component-library/features/search/RSESearchPanel';

const DEFAULT_EXPRESSION = '*';

type CreateRuleStageStorage = {
    parameters: CreateRuleParameters;
    updateStorage: (storage: CreateRuleStorage) => void;
    updateNeedsApproval: (needsApproval: boolean) => void;
    updateAskApproval: (askApproval: boolean) => void;
};

export const CreateRuleStageStorage = (props: CreateRuleStageStorage) => {
    const totalDataSize = props.parameters.dids.reduce((accumulator, current) => accumulator + current.bytes, 0);
    const selectedItems = props.parameters.rses;

    const [needsApproval, setNeedsApproval] = useState<boolean>(props.parameters.needsApproval);
    const [askApproval, setAskApproval] = useState<boolean>(props.parameters.askApproval);

    const { onGridReady, streamingHook, startStreaming, stopStreaming, gridApi } = useTableStreaming<RSEAccountUsageLimitViewModel>();

    const onSearch = (expression: string) => {
        startStreaming('/api/feature/list-account-rse-quotas', {
            method: 'POST',
            // TODO: redo the endpoint to only accept the rseExpression via GET
            body: JSON.stringify({
                rseExpression: expression ?? DEFAULT_EXPRESSION,
                requestedDIDs: props.parameters.dids,
            }),
        });
    };

    const onSelectionChanged = (event: SelectionChangedEvent) => {
        const selected: RSEAccountUsageLimitViewModel[] = event.api.getSelectedRows();
        // TODO: determine if all rows are picked and simplify the request to the rseExpression
        props.updateStorage({
            rses: selected,
        });
    };

    useEffect(() => {
        const hasSingleSufficient = selectedItems.some(element => element.bytes_remaining >= totalDataSize);
        const changeNeedsApproval = selectedItems.length > 0 && !hasSingleSufficient;
        setNeedsApproval(changeNeedsApproval);
        props.updateNeedsApproval(changeNeedsApproval);
    }, [selectedItems]);

    useEffect(() => {
        props.updateAskApproval(askApproval);
    }, [askApproval]);

    const isChoiceInvalid = needsApproval && !askApproval;

    const getInfoField = () => {
        let text;
        if (selectedItems.length === 0) {
            text = <span>Please select at least one RSE</span>;
        } else {
            text = (
                <span>
                    <b>{selectedItems.length}</b> chosen
                </span>
            );
        }
        return <InfoField>{text}</InfoField>;
    };

    const getWarningField = () => {
        let text;
        if (selectedItems.length === 1) {
            text = <span>The chosen RSE does not have enough quota left. Please choose different RSEs or mark the rule as in need of approval.</span>;
        } else {
            text = (
                <span>
                    Out of <b>{selectedItems.length}</b> chosen RSEs, none have enough quota left. Please choose different RSEs or mark the rule as
                    needing approval.
                </span>
            );
        }
        return <WarningField>{text}</WarningField>;
    };

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <RSESearchPanel
                onSearch={onSearch}
                stopStreaming={stopStreaming}
                isRunning={streamingHook.status === StreamingStatus.RUNNING}
                gridApi={gridApi ?? undefined}
            />
            <CreateRuleTableWrapper>
                <CreateRuleStageStorageTable
                    streamingHook={streamingHook}
                    onSelectionChanged={onSelectionChanged}
                    onGridReady={onGridReady}
                    totalDataSize={totalDataSize}
                    selectedItems={selectedItems}
                />
            </CreateRuleTableWrapper>
            {isChoiceInvalid ? getWarningField() : getInfoField()}
            <LabeledCheckbox checked={askApproval} onChange={() => setAskApproval(prevState => !prevState)} label="Ask for approval" />
        </div>
    );
};
